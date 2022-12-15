import Membership from "@lib/client/membership";
import { GroupRemoveRounded as NoTeamIcon } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { Avatar, Grid, List, ListItem, ListItemAvatar, ListItemButton, ListItemIcon, ListItemText, ListProps, Typography } from "@mui/material";
import { Team as PrismaTeam } from "@prisma/client";
import { useMemberships } from "@redux/slices/membership";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export type TeamListProps = ListProps;

const TeamList = (props: TeamListProps) => {
    const router = useRouter();
    const { memberships, isLoading } = useMemberships();
    const [error, setError] = useState<Error>();

    const load = async () => {
        try {
            await Membership.getAll();
            setError(null);
        } catch(e) {
            setError(e);
        }
    };

    const openTeam = (team: PrismaTeam) => router.push(`/team/${team.id}`);

    useEffect(() => {
        load();
    }, []);

    if(error) {
        return (
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Typography variant={"h5"}>
                        Something went wrong!
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <Typography>
                        {error.message}
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <LoadingButton
                        onClick={load}
                        loading={isLoading}
                        variant={"outlined"}
                    >
                        Retry
                    </LoadingButton>
                </Grid>
            </Grid>
        );
    }

    if(isLoading) {
        return (
            <Typography>
                Loading teams...
            </Typography>
        );
    }

    return (
        <List {...props}>
            {memberships.length === 0 ? (
                <ListItem>
                    <ListItemIcon>
                        <NoTeamIcon />
                    </ListItemIcon>
                    <ListItemText>
                        {"You haven't created a single team yet."}
                    </ListItemText>
                </ListItem>
            ) : memberships.map(({ team }) => (
                <ListItemButton
                    key={`list-team-button-${team.id}`}
                    onClick={() => openTeam(team)}
                >
                    <ListItemAvatar>
                        <Avatar>
                            {(team.name.charAt(0) || "?").toUpperCase()}
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText>
                        {team.name}
                    </ListItemText>
                </ListItemButton>
            ))}
        </List>
    );
};

export default TeamList;
