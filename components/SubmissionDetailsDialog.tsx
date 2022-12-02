import { Dialog, DialogContent, DialogProps, DialogTitle } from "@mui/material";
import { ExtendedSubmissionType } from "@redux/slices/membership";
import SubmissionLog from "./SubmissionLog";

export type SubmissionDetailsDialogProps = DialogProps & {
    submission: ExtendedSubmissionType;
};

const SubmissionDetailsDialog = ({ submission, ...props }: SubmissionDetailsDialogProps) => {
    return (
        <Dialog fullWidth maxWidth={"md"} {...props}>
            <DialogTitle>

            </DialogTitle>
            <DialogContent>
                <SubmissionLog
                    submission={submission}
                />
            </DialogContent>
        </Dialog>
    );
};

export default SubmissionDetailsDialog;