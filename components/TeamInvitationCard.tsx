import { Button, Card, CardProps, Grid, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { ExtendedTeamType, useMemberships } from "@redux/slices/membership";
import { useMemo, useState } from "react";
import InviteUserDialog from "./InviteUserDialog";
import TeamInvitationList from "./TeamInvitationList";

export type TeamInvitationCardProps = CardProps & {
    team: ExtendedTeamType;
};

const TeamInvitationCard = ({ team }: TeamInvitationCardProps) => {
    const [isOpen, setOpen] = useState(false);
    const { memberships } = useMemberships();

    const role = useMemo(
        () => memberships.find((membership) => membership.team.id === team.id).role,
        [memberships, team],
    );
    
    return (
        <Card>
            <Box sx={{ pt: 2, pr: 2, pl: 2 }}>
                <Grid container alignItems={"center"} spacing={1}>
                    <Grid item>
                        <Typography variant={"h6"}>
                            Pending team invitations
                        </Typography>
                    </Grid>
                </Grid>
            </Box>
            <TeamInvitationList
                team={team}
            />
        </Card>
    );  
};

export default TeamInvitationCard;