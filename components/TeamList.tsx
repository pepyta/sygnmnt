import Team from "@lib/client/team";
import { GroupRemoveRounded as NoTeamIcon } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { Avatar, Grid, List, ListItem, ListItemAvatar, ListItemButton, ListItemIcon, ListItemText, ListProps, Typography } from "@mui/material";
import { Team as PrismaTeam } from "@prisma/client";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export type TeamListProps = ListProps;

const TeamList = (props: TeamListProps) => {
    const router = useRouter();
    
    const [isLoading, setLoading] = useState(true);
    const [error, setError] = useState<Error>();
    const [teams, setTeams] = useState<PrismaTeam[]>();

    const load = async () => {
        setLoading(true);

        try {
            const { teams } = await Team.getAll();
            setTeams(teams);
            setError(null);
        } catch(e) {
            setError(e);
        } finally {
            setLoading(false);
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
            {teams.length === 0 ? (
                <ListItem>
                    <ListItemIcon>
                        <NoTeamIcon />
                    </ListItemIcon>
                    <ListItemText>
                        {"You haven't created a single team yet."}
                    </ListItemText>
                </ListItem>
            ) : teams.map((team) => (
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
