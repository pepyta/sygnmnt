import Invitation, { InvitationType } from "@lib/client/invitation";
import { CloseRounded as RejectIcon, DoneRounded as AcceptIcon } from "@mui/icons-material";
import { IconButton, ListItem, ListItemProps, ListItemSecondaryAction, ListItemText } from "@mui/material";
import { useSnackbar } from "notistack";
import { useMemo, useState } from "react";

export type InvitationListItemProps = ListItemProps & {
    invitation: InvitationType;
};

const InvitationListItem = ({ invitation, ...props }: InvitationListItemProps) => {
    const [isLoading, setLoading] = useState<boolean>(false);
    const { enqueueSnackbar } = useSnackbar();

    const date = useMemo(
        () => {
           const date = new Date(invitation.createdAt);
           return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`; 
        },
        [invitation.createdAt],
    );

    const accept = async () => {
        try {
            setLoading(true);
            await Invitation.acceptInvitation(invitation.teamId);
            enqueueSnackbar("Invitation successfully accepted!", {
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

    const reject = async () => {
        try {
            setLoading(true);
            await Invitation.rejectInvitation(invitation.teamId);enqueueSnackbar("Invitation successfully accepted!", {
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
                primary={invitation.team.name}
                secondary={date}
            />
            <ListItemSecondaryAction>
                <IconButton onClick={reject} disabled={isLoading}>
                    <RejectIcon />
                </IconButton>
                <IconButton onClick={accept} disabled={isLoading}>
                    <AcceptIcon />
                </IconButton>
            </ListItemSecondaryAction>
        </ListItem>
    );
};

export default InvitationListItem;