import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogProps, DialogTitle, Grid, Typography } from "@mui/material";
import { Submission as PrismaSubmission, Task, Team } from "@prisma/client";
import { useState } from "react";
import SubmissionList from "./SubmissionList";
import Submission from "@lib/client/submission";
import { useMount } from "@lib/client/useMount";
import { LoadingButton } from "@mui/lab";
import SubmissionCreateDialog from "./SubmissionCreateDialog";

export type TaskDetailsDialogProps = DialogProps & {
    task: Task;
    team: Team;
};

const TaskDetailsDialog = ({ task, team, ...props }: TaskDetailsDialogProps) => {
    const [submissions, setSubmission] = useState<PrismaSubmission[]>([]);
    const [isOpen, setOpen] = useState(false);
    const [isLoading, setLoading] = useState(false);
    const [error, setError] = useState<Error>();

    const loadSubmissions = async () => {
        try {
            setLoading(true);
            setSubmission(await Submission.getAll(team.id, task.id));
            setError(null);
        } catch (e) {
            setError(e);
        } finally {
            setLoading(false);
        }
    };

    const openSubmission = () => setOpen(true);

    useMount(() => {
        loadSubmissions();
    });

    return (
        <>
            <SubmissionCreateDialog
                task={task}
                team={team}
                open={isOpen}
                onClose={() => setOpen(false)}
            />
            <Dialog fullWidth maxWidth={"sm"} {...props}>
                <DialogTitle>
                    {task.name}
                </DialogTitle>
                <DialogContent>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <DialogContentText>
                                {task.description}
                            </DialogContentText>
                        </Grid>
                        <Grid item xs={12}>
                            <Button variant="contained" fullWidth onClick={openSubmission}>
                                Submit solution
                            </Button>
                        </Grid>
                        <Grid item xs={12}>
                            {error ? (
                                <Grid container spacing={1}>
                                    <Grid item xs={12}>
                                        <Typography>
                                            An error happened during the loading of submissions:
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Typography>
                                            {error.message}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <LoadingButton loading={isLoading} onClick={loadSubmissions}>
                                            Retry
                                        </LoadingButton>
                                    </Grid>
                                </Grid>
                            ) : (
                                <SubmissionList
                                    sx={{ ml: -3, mr: -3 }}
                                    submissions={submissions}
                                />
                            )}
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => props.onClose({}, "escapeKeyDown")}>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default TaskDetailsDialog;