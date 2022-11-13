import { RunnerFile } from "@lib/server/runner";
import { TreeItem, TreeView } from "@mui/lab";
import { Breadcrumbs, Button, Grid, IconButton, ListItemIcon, ListItemText, Menu, MenuItem, Typography, useTheme } from "@mui/material";
import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { DeleteRounded, FolderRounded as FolderIcon, InsertDriveFileRounded, LockRounded, NavigateNextRounded, RemoveRounded } from "@mui/icons-material";
import FileCreateDialog from "./FileCreateDialog";
import "@uiw/react-textarea-code-editor/dist.css";

const CodeEditor = dynamic(
    () => import("@uiw/react-textarea-code-editor").then((mod) => mod.default),
    { ssr: false }
);

export type FolderFormProps = {
    files: (RunnerFile & {
        disabled?: boolean;
    })[];
    onEdit: (files: RunnerFile[]) => void;
};

type FolderType = {
    path: string;
    name: string;
    files: FileType[];
    folders: FolderType[];
}

type FileType = {
    path: string;
    name: string;
    content: string;
};

type ContextMenuType = {
    mouseX: number;
    mouseY: number;
} & (
        {
            type: "folder";
            selected: FolderType;
        } | {
            type: "file";
            selected: FileType;
        }
    );

const FolderForm = ({ files, onEdit, ...props }: FolderFormProps) => {
    const [isOpen, setOpen] = useState(false);
    const [selectedPath, setSelectedPath] = useState("");
    const theme = useTheme();

    const [contextMenu, setContextMenu] = useState<ContextMenuType>(null);

    const selectedFile = useMemo(
        () => files.find((file) => file.name === selectedPath),
        [selectedPath, files],
    );

    console.log(files);

    const directory = useMemo(
        () => {
            const getFolders = (path: string) => {
                const parts = path.split("/");
                return parts.slice(0, parts.length - 1);
            };

            const getFilename = (path: string) => {
                const parts = path.split("/");
                return parts[parts.length - 1];
            };

            const directory: FolderType = {
                path: "/",
                name: "/",
                files: [],
                folders: [],
            };

            for (const file of files) {
                let folder: FolderType = directory;
                for (const name of getFolders(file.name)) {
                    const path = folder.path + name + "/";
                    const index = folder.folders.findIndex((el) => el.path === path);

                    if (index < 0) {
                        const newFolder: FolderType = {
                            path,
                            name,
                            files: [],
                            folders: [],
                        };

                        folder.folders.push(newFolder);
                        folder = newFolder;

                    } else {
                        const foundFolder = folder.folders[index];
                        folder = foundFolder;
                    }
                }

                folder.files.push({
                    path: file.name,
                    name: getFilename(file.name),
                    content: file.content,
                });
            }

            return directory;
        },
        [files],
    );

    const changeFile = (content: string) => {
        onEdit([...files].map((file) => ({
            ...file,
            content: file.name === selectedPath ? content : file.content
        })));
    };

    const createFile = (name: string) => {
        const filename = name.startsWith("/") ? name.substring(1) : name;
        onEdit([...files, {
            name: filename,
            content: "",
        }]);
    };

    const deleteFile = (path: string) => {
        setContextMenu(null);
        console.log(path);
        const newFiles = [...files].filter((file) => file.name !== path);
        onEdit(newFiles);
    };

    const deleteFolder = (path: string) => {
        console.log(path);
        setContextMenu(null);
        onEdit([...files].filter((file) => !("/" + file.name).startsWith(path)));
    };

    const renderFolder = (folder: FolderType) => {
        return (
            <>
                <TreeItem
                    onContextMenu={(e) => {
                        e.preventDefault();
                        console.log(folder);
                        setContextMenu(
                            contextMenu === null
                                ? {
                                    mouseX: e.clientX + 2,
                                    mouseY: e.clientY - 6,
                                    selected: folder,
                                    type: "folder",
                                }
                                : null,
                        );
                    }}
                    icon={<FolderIcon />}
                    nodeId={folder.path}
                    label={folder.name}
                    key={`folder-${folder.path}`}
                >
                    {folder.folders.map(renderFolder)}
                    {folder.files.map(renderFile)}
                </TreeItem>
            </>
        );
    };

    const renderFile = (file: FileType) => {
        return (
            <TreeItem
                onContextMenu={(e) => {
                    e.preventDefault();
                    setContextMenu(
                        contextMenu === null
                            ? {
                                mouseX: e.clientX + 2,
                                mouseY: e.clientY - 6,
                                selected: file,
                                type: "file",
                            }
                            : null,
                    );
                }}
                icon={files.find((el) => el.name === file.path).disabled ? <LockRounded /> : <InsertDriveFileRounded />}
                nodeId={file.path}
                label={file.name}
                key={`file-${file.path}`}
                onClick={() => setSelectedPath(file.path)}
            />
        );
    };

    return (
        <Grid container spacing={2}>
            <Menu
                MenuListProps={{
                    sx: {
                        width: 200,
                    }
                }}
                open={contextMenu !== null}
                onClose={() => setContextMenu(null)}
                anchorReference="anchorPosition"
                anchorPosition={
                    contextMenu !== null
                        ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
                        : undefined
                }
            >
                <MenuItem onClick={() => contextMenu.type === "folder"
                    ? deleteFolder(contextMenu.selected.path)
                    : deleteFile(contextMenu.selected.path)}>
                    <ListItemIcon>
                        <DeleteRounded fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Delete {contextMenu?.selected.name}</ListItemText>
                </MenuItem>
            </Menu>
            <FileCreateDialog
                open={isOpen}
                onClose={() => setOpen(false)}
                onCreate={createFile}
            />
            <Grid item xs={12} md={4}>
                <Button
                    variant={"outlined"}
                    fullWidth
                    onClick={() => setOpen(true)}
                    sx={{ mb: 1 }}
                >
                    Create new file
                </Button>
                {files.length > 0 ? (
                    <TreeView sx={{ borderRadius: theme.shape.borderRadius }}>
                        {directory.folders.map(renderFolder)}
                        {directory.files.map(renderFile)}
                    </TreeView>
                ) : (
                    <Typography textAlign={"center"} color={"GrayText"}>
                        Create the first file by clicking on the button above!
                    </Typography>
                )}
            </Grid>
            {!!selectedFile ? (
                <Grid item xs={12} md={8}>
                    <Breadcrumbs
                        sx={{ mb: 2 }}
                        separator={<NavigateNextRounded fontSize="small" />}
                    >
                        <Typography sx={{ display: "flex", alignItems: "center" }}>
                            <FolderIcon />
                        </Typography>
                        {selectedFile?.name.split("/").map((part, index) => (
                            <Typography color={selectedFile.name.split("/").length - 1 === index ? "text.primary" : "inherit"} key={`part-${index}`}>{part}</Typography>
                        ))}
                    </Breadcrumbs>
                    <CodeEditor
                        value={selectedFile.content}
                        disabled={selectedFile.disabled}
                        language={selectedPath.split(".")[selectedPath.split(".").length - 1]}
                        placeholder="Enter the code of this file"
                        onChange={(evn) => changeFile(evn.target.value)}
                        padding={16}
                        style={{
                            borderRadius: theme.shape.borderRadius,
                            fontSize: 12,
                            fontFamily: 'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace',
                        }}
                    />
                </Grid>
            ) : (
                <Grid item xs={12} md={8} sx={{ alignItems: "center", justifyContent: "center" }}>
                    <Typography textAlign={"center"} color={"GrayText"}>
                        Please select a file from the left tree view!
                    </Typography>
                </Grid>
            )}
        </Grid>
    );
};

export default FolderForm;