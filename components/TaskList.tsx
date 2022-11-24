import { List, ListProps } from "@mui/material"
import { Team } from "@prisma/client";
import { ExtendedTeamType } from "@redux/slices/membership";
import TaskListItemButton from "./TaskListItemButton";

export type TaskListProps = ListProps & {
    team: ExtendedTeamType;
};

const TaskList = ({ team, ...props }: TaskListProps) => {
    return (
        <List {...props}>
            {team.tasks.map((task) => (
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