import { AddRounded as AddIcon } from "@mui/icons-material";
import { Fab, FabProps } from "@mui/material";
import { Task, Team } from "@prisma/client";
import { useState } from "react";
import TaskCreateDialog from "./TaskCreateDialog";

export type TaskCreateFabProps = FabProps & {
    team: Team;
};

const TaskCreateFab = ({ team, ...props }: TaskCreateFabProps) => {
    const [isOpen, setOpen] = useState(false);

    return (
        <>
            <Fab
                variant={"extended"}
                onClick={() => setOpen(true)}
                {...props}
            >
                <AddIcon /> Create a new task
            </Fab>
            <TaskCreateDialog
                open={isOpen}
                onClose={() => setOpen(false)}
                team={team}
            />
        </>
    );
};

export default TaskCreateFab;