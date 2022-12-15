import Invitation, { InvitationType } from "@lib/client/invitation";
import { useMount } from "@lib/client/useMount";
import { Button, List, ListProps, Typography } from "@mui/material";
import { useState } from "react";
import { useInvitations } from "@redux/slices/invitation";
import InvitationListItem from "./InvitationListItem";

export type InvitationListProps = ListProps;

const InvitationList = (props: InvitationListProps) => {
    const { invitations, isLoading } = useInvitations();
    const [error, setError] = useState<Error>();

    const load = async () => {
        try {
            await Invitation.getAll();
        } catch(e) {
            setError(e);
        }
    };

    useMount(() => {
        load();
    });

    if(error) {
        return (
            <List {...props}>
                <Typography sx={{ p: 2 }}>
                    An error occured while loading your invitations: {error.message}
                </Typography>
                <Button variant={"outlined"}>
                    Retry
                </Button>
            </List>
        );
    }

    if(isLoading) {
        return (
            <List {...props}>
                <Typography sx={{ p: 2 }}>
                    Loading invitations...
                </Typography>
            </List>
        );
    }

    if(invitations.length === 0) {
        return (
            <List {...props}>
                <Typography sx={{ p: 2 }}>
                    {"You don't have any pending invitations!"} 
                </Typography>
            </List>
        );
    }

    return (
        <List {...props}>
            {invitations.map((invitation) => (
                <InvitationListItem
                    key={`team-invitation-item-${invitation.teamId}`}
                    invitation={invitation}
                />
            ))}
        </List>
    );
};

export default InvitationList;