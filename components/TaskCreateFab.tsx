import { AddRounded as AddIcon } from "@mui/icons-material";
import { Fab, FabProps } from "@mui/material";
import { Task, Team } from "@prisma/client";
import { useState } from "react";
import TaskCreateDialog from "./TaskCreateDialog";

export type TaskCreateFabProps = FabProps & {
    team: Team;
    onCreate: (task: Task) => void;
};

const TaskCreateFab = ({ team, onCreate, ...props }: TaskCreateFabProps) => {
    const [isOpen, setOpen] = useState(false);

    return (
        <>
            <Fab
                variant={"extended"}
                onClick={() => setOpen(true)}
                {...props}
            >
                <AddIcon /> Create a new team
            </Fab>
            <TaskCreateDialog
                open={isOpen}
                onCreate={onCreate}
                onClose={() => setOpen(false)}
                team={team}
            />
        </>
    );
};

export default TaskCreateFab;