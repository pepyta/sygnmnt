import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogProps, Grid, Typography } from "@mui/material";
import { File, Task, Team } from "@prisma/client";
import { ExtendedTaskType, useMemberships } from "@redux/slices/membership";
import { useMemo, useState } from "react";
import SubmissionCreateDialog from "./SubmissionCreateDialog";
import SubmissionListDialog from "./SubmissionListDialog";

export type TaskDetailsDialogProps = DialogProps & {
    task:  ExtendedTaskType;
};

const TaskDetailsDialog = ({ task, ...props }: TaskDetailsDialogProps) => {
    const [isCreateOpen, setCreateOpen] = useState(false);
    const [isListOpen, setListOpen] = useState(false);

    const { memberships } = useMemberships();
    const membership = useMemo(
        () => memberships.find((membership) => membership.team.tasks.some((el) => el.id === task.id)),
        [memberships, task],
    );

    
    const openListDialog = () => setListOpen(true);
    const openCreateDialog = () => setCreateOpen(true);

    return (
        <>
            <SubmissionCreateDialog
                task={task}
                open={isCreateOpen}
                onClose={() => setCreateOpen(false)}
            />
            <SubmissionListDialog
                task={task}
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
                        {membership.role === "MEMBER" && (
                            <Grid item xs={12}>
                                <Button variant="contained" fullWidth onClick={openCreateDialog}>
                                    Submit solution
                                </Button>
                            </Grid>
                        )}
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