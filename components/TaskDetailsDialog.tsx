import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogProps, Grid, ListSubheader, Tab, Typography } from "@mui/material";
import { ExtendedTaskType, useMemberships } from "@redux/slices/membership";
import { useMemo, useState } from "react";
import CloseButton from "./CloseButton";
import FolderForm from "./FolderForm";
import SubmissionCreateDialog from "./SubmissionCreateDialog";
import SubmissionList from "./SubmissionList";
import TaskDeleteDialog from "./TaskDeleteDialog";

export type TaskDetailsDialogProps = DialogProps & {
    task: ExtendedTaskType;
};

type TabType = "DESCRIPTION" | "FILES" | "OPTIONS";

const TaskDetailsDialog = ({ task, ...props }: TaskDetailsDialogProps) => {
    const [tab, setTab] = useState<TabType>("DESCRIPTION");
    const [isCreateOpen, setCreateOpen] = useState(false);
    const [isDeleteOpen, setDeleteOpen] = useState(false);

    const { memberships } = useMemberships();
    const membership = useMemo(
        () => memberships.find((membership) => membership.team.tasks.some((el) => el.id === task.id)),
        [memberships, task],
    );


    const openDeleteDialog = () => setDeleteOpen(true);

    const due = new Date(task.dueDate);
    const now = new Date();

    return (
        <>
            <SubmissionCreateDialog
                task={task}
                open={isCreateOpen}
                onClose={() => setCreateOpen(false)}
            />
            <TaskDeleteDialog
                task={task}
                open={isDeleteOpen}
                onClose={() => setDeleteOpen(false)}
            />
            <Dialog fullWidth maxWidth={"md"} {...props}>
                <DialogContent>
                    <Typography variant={"h6"}>
                        {task.name}
                    </Typography>
                    <Typography variant={"body2"}>
                        {`Created at: ${new Date(task.createdAt).toLocaleString()}`}
                    </Typography>
                </DialogContent>
                <TabContext value={tab}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <TabList onChange={(_, value) => setTab(value)} aria-label="lab API tabs example">
                            <Tab label={"Description"} value={"DESCRIPTION"} />
                            <Tab label={"Files"} value={"FILES"} />
                            <Tab label={"Submissions"} value={"SUBMISSIONS"} />
                            {(membership.role === "OWNER" || membership.role === "AUXILIARY") && (
                                <Tab label={"Options"} value={"OPTIONS"} />
                            )}
                        </TabList>
                    </Box>
                    <TabPanel value={"DESCRIPTION"}>
                        {task.description}
                    </TabPanel>
                    <TabPanel value={"FILES"}>
                        <FolderForm
                            disabled
                            files={task.files}
                        />
                    </TabPanel>
                    <TabPanel value={"SUBMISSIONS"} sx={{ padding: 0 }}>
                        {membership.role === "MEMBER" ? (
                            <Grid container>
                                <Grid item xs={12}>
                                    <Box sx={{ m: 2 }}>
                                        <Button fullWidth disabled={task.hardDeadline && due < now} variant="contained" onClick={() => setCreateOpen(true)}>
                                            {task.hardDeadline && due < now ? "Past deadline" : "Submit solution"}
                                        </Button>
                                    </Box>
                                </Grid>
                                <Grid item xs={12}>
                                    <SubmissionList
                                        dueDate={task.dueDate}
                                        hardDeadline={task.hardDeadline}
                                        submissions={task.submissions}
                                    />
                                </Grid>
                            </Grid>
                        ) : (
                            membership.team.memberships
                                .filter((membership) => membership.role === "MEMBER")
                                .map((membership) => (
                                    <SubmissionList
                                        dueDate={task.dueDate}
                                        hardDeadline={task.hardDeadline}
                                        subheader={(
                                            <ListSubheader>
                                                {membership.user.username}
                                            </ListSubheader>
                                        )}
                                        key={`submission-list-${membership.userId}`}
                                        submissions={task.submissions.filter(
                                            (submission) => submission.userId === membership.userId)
                                        }
                                    />
                                ))
                        )}
                    </TabPanel>
                    <TabPanel value={"OPTIONS"}>
                        <Button color={"error"} variant="contained" fullWidth onClick={openDeleteDialog}>
                            Delete task
                        </Button>
                    </TabPanel>
                </TabContext>
                <DialogActions>
                    <CloseButton
                        onClick={() => props.onClose({}, "escapeKeyDown")}
                    />
                </DialogActions>
            </Dialog>
        </>
    );
};

export default TaskDetailsDialog;