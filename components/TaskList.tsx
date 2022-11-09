import { List, ListProps } from "@mui/material"
import { Task, Team } from "@prisma/client";
import TaskListItemButton from "./TaskListItemButton";

export type TaskListProps = ListProps & {
    tasks: Task[];
    team: Team;
};

const TaskList = ({ tasks, team, ...props }: TaskListProps) => {
    return (
        <List {...props}>
            {tasks.map((task) => (
                <TaskListItemButton
                    team={team}
                    task={task}
                    key={`task-item-button-${task.id}`}
                />
            ))}
        </List>
    );
};

export default TaskList;