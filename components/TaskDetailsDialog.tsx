import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogProps, DialogTitle } from "@mui/material";
import { Task } from "@prisma/client";

export type TaskDetailsDialogProps = DialogProps & {
    task: Task;
};

const TaskDetailsDialog = ({ task, ...props }: TaskDetailsDialogProps) => {
    return (
        <Dialog fullWidth maxWidth={"sm"} {...props}>
            <DialogTitle>
                {task.name}
            </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    {task.description}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => props.onClose({}, "escapeKeyDown")}>
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default TaskDetailsDialog;