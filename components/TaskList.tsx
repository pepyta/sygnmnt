import { List, ListProps } from "@mui/material"
import { ExtendedMembershipType } from "@redux/slices/membership";
import TaskListItemButton from "./TaskListItemButton";

export type TaskListProps = ListProps & {
    membership: ExtendedMembershipType;
};

const TaskList = ({ membership, ...props }: TaskListProps) => {    
    return (
        <List {...props}>
            {membership.team.tasks.map((task) => (
                <TaskListItemButton
                    task={task}
                    key={`task-item-button-${task.id}`}
                />
            ))}
        </List>
    );
};

export default TaskList;