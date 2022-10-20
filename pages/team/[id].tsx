import { useUser } from "@components/UserProvider";
import Team from "@lib/client/team";
import { useMount } from "@lib/client/useMount";
import { LoadingButton } from "@mui/lab";
import { Container, Grid, Typography } from "@mui/material";
import { TeamType } from "@pages/api/team";
import { Role } from "@prisma/client";
import NextLink from "next/link";
import { useState } from "react";

export type TeamPageProps = {
    id: string;
};

const TeamPage = ({ id }: TeamPageProps) => {
    const { user } = useUser();
    const [isLoading, setLoading] = useState(true);
    const [error, setError] = useState<Error>();
    const [team, setTeam] = useState<TeamType>();
    
    const load = async () => {
        setLoading(true);

        try {
            const { name, role, members } = await Team.getByID(id);
            setTeam({name, role, members});
            setError(null);
        } catch(e) {
            setError(e);
        } finally {
            setLoading(false);
        }
    };
    
    useMount(() => {
        load();
    });
    
    if (!user) {
        return (
            <Container maxWidth={"sm"}>
                You are not logged in! <NextLink href={"/auth/login"}>Log in!</NextLink>
            </Container>
        );
    }

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
                {"Loading team's data..."}
            </Typography>
        );
    }
    
    return (
        <Container maxWidth={"sm"}>
            This is the team page for {team["name"]} (your role is {team["role"]}).
        </Container>
    );
};

TeamPage.getInitialProps = ({ query }) => {
    return {
        id: query.id,
    };
};

export default TeamPage;
