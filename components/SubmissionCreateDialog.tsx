import { RunnerFile } from "@lib/server/runner";
import { Dialog, DialogContent, DialogProps, Grid, Typography, useTheme } from "@mui/material";
import { useState } from "react";
import { LoadingButton } from "@mui/lab";
import { useSnackbar } from "notistack";
import Submission from "@lib/client/submission";
import FolderForm from "./FolderForm";
import { ExtendedTaskType } from "@redux/slices/membership";

export type SubmissionCreateDialogProps = DialogProps & {
    task: ExtendedTaskType;
};

const SubmissionCreateDialog = ({ task, ...props }: SubmissionCreateDialogProps) => {
    const theme = useTheme();
    const [isLoading, setLoading] = useState(false);
    const [files, setFiles] = useState<RunnerFile[]>([]);

    const { enqueueSnackbar } = useSnackbar();

    const submit = async () => {
        try {
            setLoading(true);

            const { message } = await Submission.create(task.id, files);
            enqueueSnackbar(message, {
                variant: "success",
            });
        } catch (e) {
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
                    <Grid item xs={12} sx={{ backgroundColor: theme.palette.background.default }}>
                        <FolderForm
                            files={[
                                ...files,
                                ...task.files.map((file) => ({
                                    ...file,
                                    disabled: true,
                                }))
                            ]}
                            onEdit={(newFiles) => {
                                setFiles(newFiles.filter((file) => !task.files.find((el) => file.name === el.name)))
                            }}
                        />
                    </Grid>
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