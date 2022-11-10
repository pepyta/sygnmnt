import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogProps, DialogTitle, Grid, Typography } from "@mui/material";
import { Submission as PrismaSubmission, Task, Team } from "@prisma/client";
import { useState } from "react";
import SubmissionList from "./SubmissionList";
import Submission from "@lib/client/submission";
import { useMount } from "@lib/client/useMount";
import { LoadingButton } from "@mui/lab";
import SubmissionCreateDialog from "./SubmissionCreateDialog";
import SubmissionListDialog from "./SubmissionListDialog";

export type TaskDetailsDialogProps = DialogProps & {
    task: Task;
    team: Team;
};

const TaskDetailsDialog = ({ task, team, ...props }: TaskDetailsDialogProps) => {
    const [isCreateOpen, setCreateOpen] = useState(false);
    const [isListOpen, setListOpen] = useState(false);

    const openListDialog = () => setListOpen(true);
    const openCreateDialog = () => setCreateOpen(true);

    return (
        <>
            <SubmissionCreateDialog
                task={task}
                team={team}
                open={isCreateOpen}
                onClose={() => setCreateOpen(false)}
            />
            <SubmissionListDialog
                task={task}
                team={team}
                open={isListOpen}
                onClose={() => setListOpen(false)}
            />
            <Dialog fullWidth maxWidth={"sm"} {...props}>
                <DialogContent>
                    <Grid container spacing={1}>
                        <Grid item xs={12}>
                            <Typography variant={"h6"}>
                                Task details
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <DialogContentText>
                                {task.description}
                            </DialogContentText>
                        </Grid>
                        <Grid item xs={12}>
                            <Button variant="contained" fullWidth onClick={openCreateDialog}>
                                Submit solution
                            </Button>
                        </Grid>
                        <Grid item xs={12}>
                            <Button variant={"outlined"} fullWidth onClick={openListDialog}>
                                List submissions
                            </Button>
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