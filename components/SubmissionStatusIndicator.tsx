import { DoneRounded, CloseRounded, BuildRounded, PlayArrowRounded, HourglassEmptyRounded, QuestionMarkRounded } from "@mui/icons-material";
import { Avatar, AvatarProps, useTheme } from "@mui/material";
import { ExtendedSubmissionType } from "@redux/slices/membership";
import { useMemo } from "react";

export type SubmissionStatusIndicatorProps = AvatarProps & {
    submission: ExtendedSubmissionType;
};

const SubmissionStatusIndicator = ({ submission, ...props }) => {
    const theme = useTheme();

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


            if(submission?.status in map) {
                return map[submission.status];
            }

            return {
                Component: QuestionMarkRounded,
                color: theme.palette.secondary.main,
            };
        },
        [submission?.status, theme],
    );

    return (
        <Avatar {...props} sx={{ backgroundColor: color, ...props.sx }}>
            <Component />
        </Avatar>
    );
};

export default SubmissionStatusIndicator;