import { Button, Card, CardProps, Grid, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { ExtendedTeamType, useMemberships } from "@redux/slices/membership";
import { useMemo, useState } from "react";
import InviteUserDialog from "./InviteUserDialog";
import MemberList from "./MemberList";

export type MemberCardProps = CardProps & {
    team: ExtendedTeamType;
};

const MemberCard = ({ team, ...props }: MemberCardProps) => {
    const [isOpen, setOpen] = useState(false);
    const { memberships } = useMemberships();

    const role = useMemo(
        () => memberships.find((membership) => membership.team.id === team.id).role,
        [memberships, team],
    );
    
    return (
        <Card {...props}>
            <InviteUserDialog
                open={isOpen}
                onClose={() => setOpen(false)}
                team={team}
            />
            <Box sx={{ pt: 2, pr: 2, pl: 2 }}>
                <Grid container alignItems={"center"} spacing={1}>
                    <Grid item>
                        <Typography variant={"h6"}>
                            Members
                        </Typography>
                    </Grid>
                    {role !== "MEMBER" && (
                        <Grid item sx={{ flexGrow: 1, textAlign: "right" }}>
                            <Button onClick={() => setOpen(true)} variant={"outlined"}>
                                Invite new member
                            </Button>
                        </Grid>
                    )}
                </Grid>
            </Box>
            <MemberList
                team={team}
            />
        </Card>
    );  
};

export default MemberCard;