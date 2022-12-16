import Task from "@lib/client/task";
import { LoadingButton } from "@mui/lab";
import { Button, Dialog, DialogActions, DialogContent, DialogProps, DialogTitle } from "@mui/material";
import { ExtendedTaskType } from "@redux/slices/membership";
import { useSnackbar } from "notistack";
import { useState } from "react";

export type TaskDeleteDialogProps = DialogProps & {
    task: ExtendedTaskType;
}

const TaskDeleteDialog = ({ task, ...props }: TaskDeleteDialogProps) => {
    const [isLoading, setLoading] = useState(false);
    const { enqueueSnackbar } = useSnackbar();

    const handleDelete = async () => {
        try {
            setLoading(true);

            const { message } = await Task.delete(task.id);
            enqueueSnackbar(message, {
                variant: "success",
            });

            setLoading(false);
        } catch(e) {
            enqueueSnackbar(e.message, {
                variant: "error",
            });

            setLoading(false);
        }
    };

    const handleClose = () => {
        if(isLoading) return;
        props.onClose({}, "backdropClick");
    }

    return (
        <Dialog {...props} onClose={handleClose}>
            <DialogTitle>
                Are you sure?
            </DialogTitle>
            <DialogContent>
                This will also delete all of the submissions that has been sent for this task.
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} disabled={isLoading}>
                    Cancel
                </Button>
                <LoadingButton
                    onClick={handleDelete}
                    color={"error"}
                    variant={"contained"}
                    loading={isLoading}
                    disabled={isLoading}
                >
                    Delete
                </LoadingButton>
            </DialogActions>
        </Dialog>
    );
};

export default TaskDeleteDialog;