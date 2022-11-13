import { ListItemButton, ListItemButtonBaseProps, ListItemText } from "@mui/material";
import { File, Task, Team } from "@prisma/client";
import { useState } from "react";
import TaskDetailsDialog from "./TaskDetailsDialog";

export type TaskListItemButtonProps = ListItemButtonBaseProps & {
    task: Task & {
        files: File[];
    };
    team: Team;
};

const TaskListItemButton = ({ task, team, ...props }: TaskListItemButtonProps) => {
    const [isOpen, setOpen] = useState(false);

    return (
        <>
            <ListItemButton onClick={() => setOpen(true)} {...props}>
                <ListItemText
                    primary={`${task.name}`}
                    secondary={`Created at: ${new Date(task.createdAt).toLocaleDateString()}${task.dueAt ? `, due at: ${new Date(task.dueAt).toLocaleDateString()}` : ""}`}
                />
            </ListItemButton>
            <TaskDetailsDialog
                open={isOpen}
                onClose={() => setOpen(false)}
                team={team}
                task={task}
            />
        </>
    );
};

export default TaskListItemButton;