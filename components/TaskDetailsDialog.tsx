import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogProps, Grid, Tab, Typography } from "@mui/material";
import { File, Task, Team } from "@prisma/client";
import { ExtendedTaskType, useMemberships } from "@redux/slices/membership";
import { useMemo, useState } from "react";
import CloseButton from "./CloseButton";
import FolderForm from "./FolderForm";
import SelectStudentDialog from "./SelectStudentDialog";
import SubmissionCreateDialog from "./SubmissionCreateDialog";
import SubmissionListDialog from "./SubmissionListDialog";
import TaskDeleteDialog from "./TaskDeleteDialog";

export type TaskDetailsDialogProps = DialogProps & {
    task: ExtendedTaskType;
};

type TabType = "DESCRIPTION" | "FILES" | "OPTIONS";

const TaskDetailsDialog = ({ task, ...props }: TaskDetailsDialogProps) => {
    const [tab, setTab] = useState<TabType>("DESCRIPTION");
    const [isCreateOpen, setCreateOpen] = useState(false);
    const [isDeleteOpen, setDeleteOpen] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [isStudentSelectOpen, setStudentSelectOpen] = useState(false);
    const [isListOpen, setListOpen] = useState(false);

    const { memberships } = useMemberships();
    const membership = useMemo(
        () => memberships.find((membership) => membership.team.tasks.some((el) => el.id === task.id)),
        [memberships, task],
    );


    const openListDialog = () => {
        if (membership.role === "MEMBER") {
            setListOpen(true);
        } else {
            setStudentSelectOpen(true);
        }
    };

    const openCreateDialog = () => setCreateOpen(true);
    const openDeleteDialog = () => setDeleteOpen(true);

    return (
        <>
            {membership.role === "MEMBER" && (
                <SubmissionListDialog
                    submissions={task.submissions}
                    open={isListOpen}
                    onClose={() => setListOpen(false)}
                />
            )}
            {!!selectedStudent && (
                <SubmissionListDialog
                    submissions={task.submissions
                        .filter(
                            (submission) => submission.userId === selectedStudent.id
                        )
                    }
                    open={isListOpen}
                    onClose={() => setListOpen(false)}
                />
            )}
            <SelectStudentDialog
                onSelect={(student) => {
                    setSelectedStudent(student);
                    setListOpen(true);
                }}
                students={membership.team.memberships
                    .filter((membership) => membership.role === "MEMBER")
                    .map((membership) => membership.user)
                }
                open={isStudentSelectOpen}
                onClose={() => setStudentSelectOpen(false)}
            />
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
                            <Tab label={"Options"} value={"OPTIONS"} />
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
                    <TabPanel value={"OPTIONS"}>
                        <Grid container spacing={2}>
                            {membership.role === "MEMBER" && (
                                <Grid item xs={12}>
                                    <Button variant="contained" fullWidth onClick={openCreateDialog}>
                                        Submit solution
                                    </Button>
                                </Grid>
                            )}
                            <Grid item xs={12}>
                                <Button variant="contained" fullWidth onClick={openListDialog}>
                                    List submissions
                                </Button>
                            </Grid>
                            {(membership.role === "AUXILIARY" || membership.role === "OWNER") && (
                                <Grid item xs={12}>
                                    <Button color={"error"} variant="contained" fullWidth onClick={openDeleteDialog}>
                                        Delete task
                                    </Button>
                                </Grid>
                            )}
                        </Grid>
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