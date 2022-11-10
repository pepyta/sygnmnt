import Submission from "@lib/client/submission";
import { useMount } from "@lib/client/useMount";
import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogProps, Grid, Typography } from "@mui/material";
import { Submission as PrismaSubmission, Task, Team } from "@prisma/client";
import { useState } from "react";
import SubmissionList from "./SubmissionList";

export type SubmissionListDialogProps = DialogProps & {
    task: Task;
    team: Team;
};

const SubmissionListDialog = ({ task, team, ...props }: SubmissionListDialogProps) => {
    const [isLoading, setLoading] = useState(false);
    const [submissions, setSubmission] = useState<PrismaSubmission[]>([]);
    const [error, setError] = useState<Error>();

    const load = async () => {
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

    useMount(() => {
        load();
    });

    return (
        <Dialog fullWidth maxWidth={"sm"} {...props}>
            <DialogContent>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Typography variant={"h6"}>
                            Submissions
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        {isLoading ? (
                            <CircularProgress />
                        ) : error ? (
                            <Typography>
                                An error happend while loading the submissions: {error.message}
                            </Typography>
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
                            <Button onClick={() => props.onClose({}, "backdropClick")}>
                                Close
                            </Button>
            </DialogActions>
        </Dialog>
    );
};

export default SubmissionListDialog;