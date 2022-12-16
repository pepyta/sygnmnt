import { LoadingButton, TabContext, TabList, TabPanel } from "@mui/lab";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogProps, DialogTitle, Grid, Tab, Tabs, Typography } from "@mui/material";
import { ExtendedSubmissionType, useMemberships } from "@redux/slices/membership";
import { useMemo, useState } from "react";
import FolderForm from "./FolderForm";
import SubmissionLog from "./SubmissionLog";
import SubmissionStatusSelect from "./SubmissionStatusSelect";
import * as Prisma from "@prisma/client";
import Submission from "@lib/client/submission";
import { useSnackbar } from "notistack";

export type SubmissionDetailsDialogProps = DialogProps & {
    submission: ExtendedSubmissionType;
};

type TabType = "LOGS" | "FILES" | "OPTIONS";

const SubmissionDetailsDialog = ({ submission, ...props }: SubmissionDetailsDialogProps) => {
    const [tab, setTab] = useState<TabType>("LOGS");
    const [status, setStatus] = useState<Prisma.SubmissionStatus>(submission.status);
    const [loading, setLoading] = useState<"EDIT" | "DELETE">();
    const { memberships } = useMemberships();
    const membership = useMemo(
        () => memberships.find((membership) => membership.team.tasks.some((el) => el.submissions.some((el) => el.id === submission.id))),
        [memberships, submission.id],
    );

    const { enqueueSnackbar } = useSnackbar();

    const date = useMemo(
        () => {
            const d = new Date(submission.createdAt);
            return `${d.toLocaleDateString()} ${d.toLocaleTimeString()}`;
        },
        [submission.createdAt],
    );

    const handleChange = async (status: Prisma.SubmissionStatus) => {
        try {
            setLoading("EDIT");
            setStatus(status);

            const { message } = await Submission.edit(submission.id, status);
            enqueueSnackbar(message, {
                variant: "success",
            });

            setLoading(null);
        } catch (e) {
            setLoading(null);
            setStatus(submission.status);
        }
    }

    const handleDelete = async () => {
        try {
            setLoading("DELETE");

            const { message } = await Submission.delete(submission.id);
            enqueueSnackbar(message, {
                variant: "success",
            });

            setLoading(null);
        } catch (e) {
            setLoading(null);
        }
        
    };

    return (
        <Dialog fullWidth maxWidth={"md"} {...props}>
            <DialogTitle>
                Submission details
                <Typography variant={"body2"}>
                    Submitted by {submission.user.username} at {date}.
                </Typography>
            </DialogTitle>
            <TabContext value={tab}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <TabList onChange={(_, value) => setTab(value)}>
                        <Tab label={"Logs"} value={"LOGS"} />
                        <Tab label={"Submitted files"} value={"FILES"} />
                        <Tab label={"Options"} value={"OPTIONS"} />
                    </TabList>
                </Box>
                <TabPanel value={"LOGS"}>
                    <SubmissionLog
                        submission={submission}
                    />
                </TabPanel>
                <TabPanel value={"FILES"}>
                    <FolderForm
                        disabled
                        files={submission.files}
                    />
                </TabPanel>
                <TabPanel value={"OPTIONS"}>
                    <Grid container spacing={2}>
                        {(membership.role === "OWNER" || membership.role === "AUXILIARY") && (
                            <Grid item xs={12}>
                                <SubmissionStatusSelect
                                    value={status}
                                    disabled={!!loading}
                                    onChange={(e) => handleChange(e.target.value as Prisma.SubmissionStatus)}
                                />
                            </Grid>
                        )}
                        <Grid item xs={12}>
                            <LoadingButton
                                fullWidth
                                color={"error"}
                                onClick={handleDelete}
                                loading={loading === "DELETE"}
                                variant={"contained"}
                                disabled={!!loading}
                            >
                                Delete submission
                            </LoadingButton>
                        </Grid>
                    </Grid>
                </TabPanel>
            </TabContext>
            <DialogActions>
                <Button onClick={() => props.onClose({}, "backdropClick")}>
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default SubmissionDetailsDialog;