import { Button, Dialog, DialogActions, DialogContent, DialogProps, DialogTitle, Grid, TextField, Typography } from "@mui/material";
import { ProgrammingLanguage, Task as PrismaTask, Team } from "@prisma/client";
import { useSnackbar } from "notistack";
import { useState } from "react";
import ProgrammingLanugageSelect from "./ProgrammingLanugageSelect";
import Task from "@lib/client/task";
import { LoadingButton } from "@mui/lab";
import FolderForm from "./FolderForm";
import { RunnerFile } from "@lib/server/runner";
import dynamic from "next/dynamic";
import "@uiw/react-textarea-code-editor/dist.css";

const CodeEditor = dynamic(
    () => import("@uiw/react-textarea-code-editor").then((mod) => mod.default),
    { ssr: false }
);


export type TaskCreateDialogProps = DialogProps & {
    team: Team;
    onCreate: (task: PrismaTask) => void;
};

const TaskCreateDialog = ({ onCreate, team, ...props }: TaskCreateDialogProps) => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [language, setLanguage] = useState<ProgrammingLanguage>("CPP");
    const [isLoading, setLoading] = useState(false);
    const [page, setPage] = useState<"SUMMARY" | "FILES">("SUMMARY");
    const [files, setFiles] = useState<RunnerFile[]>([]);

    const { enqueueSnackbar } = useSnackbar();

    const create = async () => {
        try {
            setLoading(true);

            const { message, task } = await Task.create(team.id, name, description, language, files);
            onCreate(task);
            props.onClose({}, "backdropClick");
            enqueueSnackbar(message);
        } catch (e) {
            enqueueSnackbar(e.message, {
                variant: "error",
            });

            setLoading(false);
        }
    };

    if (page === "FILES") {
        return (

            <Dialog fullWidth maxWidth={"md"} {...props}>
                <DialogContent>
                    <FolderForm
                        onEdit={setFiles}
                        files={[
                            ...files,
                        ].map((file) => ({
                            ...file,
                            disabled: isLoading,
                        }))}
                    />
                </DialogContent>
                <DialogActions>
                    <Button
                        disabled={isLoading}
                        onClick={() => setPage("SUMMARY")}
                    >
                        Back
                    </Button>
                    <LoadingButton
                        loading={isLoading}
                        disabled={isLoading || files.length === 0}
                        variant={"contained"}
                        onClick={create}
                    >
                        Create
                    </LoadingButton>
                </DialogActions>
            </Dialog>
        );
    }

    return (
        <Dialog fullWidth maxWidth={"sm"} {...props}>
            <DialogContent>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Typography variant={"h6"}>
                            Task creation
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            disabled={isLoading}
                            required
                            autoFocus
                            fullWidth
                            label={"Name"}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <CodeEditor
                            disabled={isLoading}
                            required
                            language="markdown"
                            label={"Description"}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <ProgrammingLanugageSelect
                            disabled={isLoading}
                            required
                            value={language}
                            onChange={(e) => setLanguage(e.target.value as ProgrammingLanguage)}
                        />
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button
                    disabled={isLoading}
                    onClick={() => props.onClose({}, "backdropClick")}
                >
                    Close
                </Button>
                <LoadingButton
                    disabled={name.length === 0 || description.length === 0}
                    variant={"contained"}
                    onClick={() => setPage("FILES")}
                >
                    Next
                </LoadingButton>
            </DialogActions>

        </Dialog>
    );
};

export default TaskCreateDialog;