import { Dialog, DialogProps, DialogTitle } from "@mui/material";

export type SubmissionDetailsDialogProps = DialogProps & {
    
};

const SubmissionDetailsDialog = ({ ...props }: SubmissionDetailsDialogProps) => {
    return (
        <Dialog fullWidth maxWidth={"sm"} {...props}>
            <DialogTitle>

            </DialogTitle>
        </Dialog>
    );
};

export default SubmissionDetailsDialog;