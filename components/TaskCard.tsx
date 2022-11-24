import team from "@lib/server/team";
import { Box, Button, Card, CardProps, Grid, Typography } from "@mui/material";
import { ExtendedMembershipType } from "@redux/slices/membership";
import { useState } from "react";
import TaskCreateDialog from "./TaskCreateDialog";
import TaskList from "./TaskList";

export type TaskCardProps = CardProps & {
    membership: ExtendedMembershipType;
};

const TaskCard = ({ membership, ...props }: TaskCardProps) => {
    const [isOpen, setOpen] = useState(false);

    const handleClose = () => setOpen(false);
    const handleOpen = () => setOpen(true);

    return (
        <Card {...props}>
            <TaskCreateDialog
                open={isOpen}
                onClose={handleClose}
                team={membership.team}
            />
            <Box sx={{ pt: 2, pr: 2, pl: 2 }}>
                <Grid container alignItems={"center"} spacing={1}>
                    <Grid item>
                        <Typography variant={"h6"}>
                            Tasks
                        </Typography>
                    </Grid>
                    {membership.role !== "MEMBER" && (
                        <Grid item sx={{ flexGrow: 1, textAlign: "right" }}>
                            <Button onClick={handleOpen} variant={"outlined"}>
                                Create new task
                            </Button>
                        </Grid>
                    )}
                </Grid>
            </Box>
            <TaskList
                membership={membership}
            />
        </Card>
    );
};

export default TaskCard;