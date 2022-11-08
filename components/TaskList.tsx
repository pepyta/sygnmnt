import { List, ListProps } from "@mui/material"
import { Task } from "@prisma/client";
import TaskListItemButton from "./TaskListItemButton";

export type TaskListProps = ListProps & {
    tasks: Task[];
};

const TaskList = ({ tasks, ...props }: TaskListProps) => {
    return (
        <List {...props}>
            {tasks.map((task) => (
                <TaskListItemButton
                    task={task}
                    key={`task-item-button-${task.id}`}
                />
            ))}
        </List>
    );
};

export default TaskList;