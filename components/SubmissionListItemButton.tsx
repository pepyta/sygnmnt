import { BuildRounded, CloseRounded, DoneRounded, HourglassEmptyRounded, PlayArrowRounded } from "@mui/icons-material";
import { Avatar, ListItemAvatar, ListItemButton, ListItemButtonProps, ListItemText, useTheme } from "@mui/material";
import { ExtendedSubmissionType } from "@redux/slices/membership";
import { useMemo, useState } from "react";
import SubmissionDetailsDialog from "./SubmissionDetailsDialog";
import SubmissionStatusIndicator from "./SubmissionStatusIndicator";

export type SubmissionListItemButtonProps = ListItemButtonProps & {
    submission: ExtendedSubmissionType;
};

const SubmissionListItemButton = ({ submission, ...props }: SubmissionListItemButtonProps) => {
    const [isOpen, setOpen] = useState(false);
    const theme = useTheme();

    const date = useMemo(
        () => {
            const d = new Date(submission.createdAt);
            return `${d.toLocaleDateString()} ${d.toLocaleTimeString()}`;
        },
        [submission.createdAt],
    );

    return (
        <>
            <ListItemButton onClick={() => setOpen(true)} {...props}>
                <ListItemAvatar>
                    <SubmissionStatusIndicator
                        submission={submission}
                    />
                </ListItemAvatar>
                <ListItemText
                    primary={`Submitted at ${date}`}
                />
            </ListItemButton>
            <SubmissionDetailsDialog
                submission={submission}
                open={isOpen}
                onClose={() => setOpen(false)}
            />
        </>
    );
};

export default SubmissionListItemButton;