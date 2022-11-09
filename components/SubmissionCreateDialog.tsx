import { RunnerFile } from "@lib/server/runner";
import { Button, Dialog, DialogActions, DialogContent, DialogProps, Grid, TextField, Typography, useTheme } from "@mui/material";
import { Task, Team } from "@prisma/client";
import { useState } from "react";
import dynamic from "next/dynamic";
import "@uiw/react-textarea-code-editor/dist.css";
import { LoadingButton } from "@mui/lab";
import { useSnackbar } from "notistack";
import Submission from "@lib/client/submission";

export type SubmissionCreateDialogProps = DialogProps & {
    task: Task;
    team: Team;
};

const CodeEditor = dynamic(
    () => import("@uiw/react-textarea-code-editor").then((mod) => mod.default),
    { ssr: false }
);

const SubmissionCreateDialog = ({ team, task, ...props }: SubmissionCreateDialogProps) => {
    const theme = useTheme();
    const [isLoading, setLoading] = useState(false);
    const [files, setFiles] = useState<RunnerFile[]>([]);

    const { enqueueSnackbar } = useSnackbar();

    const createFile = () => setFiles([...files, { name: "Untitled", content: "" }]);

    const changeName = (index: number, name: string) => {
        const newFiles = [...files];
        files[index].name = name;
        setFiles(newFiles);
    };

    const changeContent = (index: number, content: string) => {
        const newFiles = [...files];
        files[index].content = content;
        setFiles(newFiles);
    };

    const submit = async () => {
        try {
            setLoading(true);

            const { message } = await Submission.create(team.id, task.id, files);
            enqueueSnackbar(message, {
                variant: "success",
            });
        } catch(e) {
            enqueueSnackbar(e.message, {
                variant: "error",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog fullWidth maxWidth={"md"} {...props}>
            <DialogContent>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Typography variant={"h6"}>
                            Submit solution
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Button disabled={isLoading} variant={"outlined"} onClick={createFile}>
                            Create new file
                        </Button>
                    </Grid>
                    {files.map((file, index) => (
                        <Grid item xs={12} key={`file-editor-${index}`}>
                            <Grid container spacing={1}>
                                <Grid item xs={12}>
                                    <TextField
                                        size={"medium"}
                                        fullWidth
                                        disabled={isLoading}
                                        label={"File name"}
                                        value={file.name}
                                        onChange={(e) => changeName(index, e.target.value)}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <CodeEditor
                                        disabled={isLoading}
                                        value={file.content}
                                        language={task.language.toLowerCase()}
                                        placeholder="Enter the code of this file"
                                        onChange={(evn) => changeContent(index, evn.target.value)}
                                        padding={16}
                                        style={{
                                            borderRadius: theme.shape.borderRadius,
                                            fontSize: 12,
                                            backgroundColor: "#f5f5f5",
                                            fontFamily: 'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace',
                                        }}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                    ))}
                    <Grid item xs={12}>
                        <LoadingButton onClick={submit} loading={isLoading} disabled={files.length === 0} variant={"contained"} sx={{ ml: "auto" }}>
                            Submit
                        </LoadingButton>
                    </Grid>
                </Grid>
            </DialogContent>
        </Dialog>
    );
};

export default SubmissionCreateDialog;