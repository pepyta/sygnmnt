import { Button, Dialog, DialogActions, DialogContent, DialogProps, DialogTitle, Typography } from "@mui/material";
import { ExtendedSubmissionType } from "@redux/slices/membership";
import { useMemo } from "react";
import SubmissionLog from "./SubmissionLog";

export type SubmissionDetailsDialogProps = DialogProps & {
    submission: ExtendedSubmissionType;
};

const SubmissionDetailsDialog = ({ submission, ...props }: SubmissionDetailsDialogProps) => {
    const date = useMemo(
        () => {
            const d = new Date(submission.createdAt);
            return `${d.toLocaleDateString()} ${d.toLocaleTimeString()}`;
        },
        [submission.createdAt],
    );
    
    return (
        <Dialog fullWidth maxWidth={"md"} {...props}>
            <DialogTitle>
                Submission details
                <Typography variant={"body2"}>
                    Submitted by {submission.user.username} at {date}.
                </Typography>
            </DialogTitle>
            <DialogContent>
                <SubmissionLog
                    submission={submission}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={() => props.onClose({}, "backdropClick")}>
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default SubmissionDetailsDialog;