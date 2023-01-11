import { ListItemAvatar, ListItemButton, ListItemButtonBaseProps, ListItemText } from "@mui/material";
import { ExtendedTaskType, useMemberships } from "@redux/slices/membership";
import { useMemo, useState } from "react";
import SubmissionStatusIndicator from "./SubmissionStatusIndicator";
import TaskDetailsDialog from "./TaskDetailsDialog";

export type TaskListItemButtonProps = ListItemButtonBaseProps & {
    task: ExtendedTaskType;
};

const TaskListItemButton = ({ task, ...props }: TaskListItemButtonProps) => {
    const [isOpen, setOpen] = useState(false);
    const { memberships } = useMemberships();
    const membership = useMemo(
        () => memberships.find((membership) => membership.teamId === task.teamId),
        [memberships, task],
    );

    return (
        <>
            <ListItemButton onClick={() => setOpen(true)} {...props}>
                {membership.role === "MEMBER" && (
                    <ListItemAvatar>
                        <SubmissionStatusIndicator
                            dueDate={task.dueDate}
                            hardDeadline={task.hardDeadline}
                            submission={task.submissions.length === 0 ? null : task.submissions[0]}
                        />
                    </ListItemAvatar>
                )}
                <ListItemText
                    primary={`${task.name}`}
                    secondary={`Created at: ${new Date(task.createdAt).toLocaleDateString()}${task.dueDate && task.hardDeadline ? `, due at: ${new Date(task.dueDate).toLocaleDateString()} ${new Date(task.dueDate).toLocaleTimeString()}` : ""}`}
                />
            </ListItemButton>
            <TaskDetailsDialog
                open={isOpen}
                onClose={() => setOpen(false)}
                task={task}
            />
        </>
    );
};

export default TaskListItemButton;