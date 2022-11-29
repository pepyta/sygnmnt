import Submission from "@lib/client/submission";
import { useMount } from "@lib/client/useMount";
import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogProps, Grid, Typography } from "@mui/material";
import { Submission as PrismaSubmission, Task, Team } from "@prisma/client";
import { ExtendedTaskType, useMemberships } from "@redux/slices/membership";
import { useMemo, useState } from "react";
import SubmissionList from "./SubmissionList";

export type SubmissionListDialogProps = DialogProps & {
    task: ExtendedTaskType;
};

const SubmissionListDialog = ({ task, ...props }: SubmissionListDialogProps) => {
    const { memberships } = useMemberships();
    const membership = useMemo(
        () => memberships.find((el) => el.team.tasks.some((el) => el.id === task.id)),
        [memberships, task],
    );

    const [error, setError] = useState<Error>();

    const load = async () => {
        try {
            setError(null);
            setTimeout(() => load(), 2000);
        } catch (e) {
            setError(e);
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
                        {error ? (
                            <Typography>
                                An error happend while loading the submissions: {error.message}
                            </Typography>
                        ) : (
                            <SubmissionList
                                sx={{ ml: -3, mr: -3 }}
                                submissions={task.submissions}
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