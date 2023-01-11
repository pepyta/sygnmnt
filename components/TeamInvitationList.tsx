import { Button, List, ListProps, Typography } from "@mui/material";
import { Role } from "@prisma/client";
import { ExtendedTeamType } from "@redux/slices/membership";
import { useMemo, useState } from "react";
import MemberListItem from "./MemberListItem";

import Invitation, { TeamInvitationType } from "@lib/client/invitation";
import { useMount } from "@lib/client/useMount";
import { useTeamInvitations } from "@redux/slices/teamInvitation";
import TeamInvitationListItem from "./TeamInvitationListItem";

export type TeamInvitationListProps = ListProps & {
    team: ExtendedTeamType;
};

const TeamInvitationList = ({ team, ...props }: TeamInvitationListProps) => {
    const { teamInvitations, isLoading } = useTeamInvitations();
    const [error, setError] = useState<Error>();

    const load = async () => {
        try {
            await Invitation.getTeamAll(team.id);
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
                    An error occured while loading the team&apos;s invitations: {error.message}
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

    if(teamInvitations.length === 0) {
        return (
            <List {...props}>
                <Typography sx={{ p: 2 }}>
                    {"This team doesn't have any pending invitations!"} 
                </Typography>
            </List>
        );
    }

    return (
        <List {...props}>
            {teamInvitations.map((teamInvitation) => (
                <TeamInvitationListItem
                    key={`Team-invitation-item-${teamInvitation.teamId}`}
                    teamInvitation={teamInvitation}
                />
            ))}
        </List>
    );
};

export default TeamInvitationList;