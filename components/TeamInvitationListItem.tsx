import Invitation, { TeamInvitationType } from "@lib/client/invitation";
import { DeleteRounded as RevokeIcon } from "@mui/icons-material";
import { IconButton, ListItem, ListItemProps, ListItemSecondaryAction, ListItemText } from "@mui/material";
import { useSnackbar } from "notistack";
import { useMemo, useState } from "react";

export type TeamInvitationListItemProps = ListItemProps & {
    teamInvitation: TeamInvitationType;
};

const TeamInvitationListItem = ({ teamInvitation, ...props }: TeamInvitationListItemProps) => {
    const [isLoading, setLoading] = useState<boolean>(false);
    const { enqueueSnackbar } = useSnackbar();

    const date = useMemo(
        () => {
           const date = new Date(teamInvitation.createdAt);
           return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`; 
        },
        [teamInvitation.createdAt],
    );

    const revoke = async () => {
        try {
            setLoading(true);
            await Invitation.revoke(teamInvitation.teamId, teamInvitation.userId);
            enqueueSnackbar("Invitation successfully revoked!", {
                variant: "success",
            });
        } catch(e) {
            enqueueSnackbar(e.message, {
                variant: "error",
            });
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <ListItem {...props}>
            <ListItemText
                primary={teamInvitation.username}
                secondary={date}
            />
            <ListItemSecondaryAction>
                <IconButton onClick={revoke} disabled={isLoading}>
                    <RevokeIcon />
                </IconButton>
            </ListItemSecondaryAction>
        </ListItem>
    );
};

export default TeamInvitationListItem;