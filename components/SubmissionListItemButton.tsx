import { BuildRounded, CloseRounded, DoneRounded, HourglassEmptyRounded, PlayArrowRounded } from "@mui/icons-material";
import { Avatar, CircularProgress, ListItemAvatar, ListItemButton, ListItemButtonProps, ListItemIcon, ListItemText, useTheme } from "@mui/material";
import { Submission } from "@prisma/client";
import { useMemo, useState } from "react";
import SubmissionDetailsDialog from "./SubmissionDetailsDialog";

export type SubmissionListItemButtonProps = ListItemButtonProps & {
    submission: Submission;
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

    const { Component, color } = useMemo(
        () => {
            const map = {
                PASSED: {
                    Component: DoneRounded,
                    color: theme.palette.success.main,
                },
                FAILED: {
                    Component: CloseRounded,
                    color: theme.palette.error.main,
                },
                BUILDING: {
                    Component: BuildRounded,
                    color: theme.palette.primary.main,
                },
                RUNNING: {
                    Component: PlayArrowRounded,
                    color: theme.palette.primary.main,
                },
                WAITING: {
                    Component: HourglassEmptyRounded,
                    color: theme.palette.secondary.main,
                },
            };

            return map[submission.status];
        },
        [submission.status, theme],
    );

    return (
        <>

        <ListItemButton onClick={() => setOpen(true)} {...props}>
            <ListItemAvatar>
                <Avatar sx={{ backgroundColor: color }}>
                    <Component />
                </Avatar>
            </ListItemAvatar>
            <ListItemText
                primary={`Submitted at ${date}`}
            />
        </ListItemButton>
        <SubmissionDetailsDialog
            open={isOpen}
            onClose={() => setOpen(false)}
        />
        </>
    );
};

export default SubmissionListItemButton;