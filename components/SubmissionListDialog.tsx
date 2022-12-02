import { useMount } from "@lib/client/useMount";
import { Button, Dialog, DialogActions, DialogContent, DialogProps, Grid, Typography } from "@mui/material";
import { ExtendedSubmissionType } from "@redux/slices/membership";
import { useState } from "react";
import SubmissionList from "./SubmissionList";

export type SubmissionListDialogProps = DialogProps & {
    submissions: ExtendedSubmissionType[];
};

const SubmissionListDialog = ({ submissions, ...props }: SubmissionListDialogProps) => {
    const [error, setError] = useState<Error>();

    const load = async () => {
        try {
            setError(null);
            setTimeout(() => load(), 2000);
        } catch (e) {
            setError(e);
        }
    };

    useMount(() => {
        load();
    });

    return (
        <Dialog fullWidth maxWidth={"sm"} {...props}>
            <DialogContent>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Typography variant={"h6"}>
                            Submissions
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        {error ? (
                            <Typography>
                                An error happend while loading the submissions: {error.message}
                            </Typography>
                        ) : submissions.length === 0 ? (
                            <Typography>
                                No submissions found for this task.
                            </Typography>
                        ) : (
                            <SubmissionList
                                sx={{ ml: -3, mr: -3 }}
                                submissions={submissions}
                            />
                        )}
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => props.onClose({}, "backdropClick")}>
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default SubmissionListDialog;