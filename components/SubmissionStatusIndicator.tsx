import { Warning, LockClock, DoneRounded, CloseRounded, BuildRounded, PlayArrowRounded, HourglassEmptyRounded, QuestionMarkRounded } from "@mui/icons-material";
import { Avatar, AvatarProps, useTheme } from "@mui/material";
import { ExtendedSubmissionType } from "@redux/slices/membership";
import { useMemo } from "react";

export type SubmissionStatusIndicatorProps = AvatarProps & {
    dueDate: Date;
    hardDeadline: boolean;
    submission: ExtendedSubmissionType;
};

const SubmissionStatusIndicator = ({ dueDate, hardDeadline, submission, ...props }) => {
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
                AWAITING_MANUAL_CHECK: {
                    Component: HourglassEmptyRounded,
                    color: theme.palette.warning.main,
                },
            };


            if(submission?.status in map) {
                return map[submission.status];
            }

            const due = new Date(dueDate);
            const now = new Date();

            if(hardDeadline){
                if(due < now){
                    return {
                        Component: LockClock,
                        color: theme.palette.error.main,
                    };
                } else if(now.valueOf() - due.valueOf() < 24 * 3600000) {
                    return {
                        Component: Warning,
                        color: theme.palette.warning.main,
                    };
                }
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