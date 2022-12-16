import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogProps, DialogTitle, Tab, Tabs, Typography } from "@mui/material";
import { ExtendedSubmissionType } from "@redux/slices/membership";
import { useMemo, useState } from "react";
import FolderForm from "./FolderForm";
import SubmissionLog from "./SubmissionLog";

export type SubmissionDetailsDialogProps = DialogProps & {
    submission: ExtendedSubmissionType;
};

type TabType = "LOGS" | "FILES";

const SubmissionDetailsDialog = ({ submission, ...props }: SubmissionDetailsDialogProps) => {
    const [tab, setTab] = useState<TabType>("LOGS");

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
            <TabContext value={tab}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <TabList onChange={(_, value) => setTab(value)}>
                        <Tab label={"Logs"} value={"LOGS"} />
                        <Tab label={"Submitted files"} value={"FILES"} />
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
            </TabContext>
            <DialogContent>

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