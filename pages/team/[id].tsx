import TaskCreateFab from "@components/TaskCreateFab";
import TaskList from "@components/TaskList";
import { useUser } from "@components/UserProvider";
import { useMount } from "@lib/client/useMount";
import { LoadingButton } from "@mui/lab";
import { Button, Card, CardContent, Container, Grid, Typography } from "@mui/material";
import { ArrowBackRounded as PreviousPageIcon } from "@mui/icons-material";
import NextLink from "next/link";
import { useMemo, useState } from "react";
import MemberCard from "@components/MemberCard";
import TeamInvitationCard from "@components/TeamInvitationCard";
import Membership from "@lib/client/membership";
import { TeamNotFoundError } from "@lib/server/errors";
import { useMemberships } from "@redux/slices/membership";
import TaskCard from "@components/TaskCard";
import { useRouter } from "next/router";

export type TeamPageProps = {
    id: string;
};

const TeamPage = ({ id }: TeamPageProps) => {
    const { user } = useUser();
    const [error, setError] = useState<Error>();
    const { memberships, isLoading } = useMemberships();
    const router = useRouter();

    const membership = useMemo(
        () => memberships.find((membership) => membership.team.id === id),
        [memberships, id],
    );
    
    const load = async () => {
        try {
            const memberships = await Membership.getAll();
            if(!memberships.some((membership) => membership.team.id === id)) {
                throw new TeamNotFoundError();
            }

            setError(null);
        } catch(e) {
            setError(e);
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
    
    if(!membership) {
        if(!isLoading) {
            router.push("/");
        }

        return (
            <Typography>
                {"Loading team's data..."}
            </Typography>
        );
    }
    
    return (
        <Container maxWidth={"sm"} sx={{ pt: 2, pb: 2}}>
            <Grid container spacing={2}>
                <Grid item xs={3} sx={{ display: 'flex', alignItems: 'center' }}>
                    <Button onClick={() => router.back()} startIcon={<PreviousPageIcon />}>
                        Go back
                    </Button>
                </Grid>
                <Grid item xs={6}>
                    <Typography align="center" variant={"h5"}>
                        {membership.team.name}
                    </Typography>
                    <Typography align="center" >
                        {`Role: ${membership.role}`}
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <TaskCard
                        membership={membership}
                    />
                </Grid>
                <Grid item xs={12}>
                    <MemberCard
                        team={membership.team}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TeamInvitationCard
                        team={membership.team}
                    />
                </Grid>
            </Grid>
        </Container>
    );
};

TeamPage.getInitialProps = ({ query }) => {
    return {
        id: query.id,
    };
};

export default TeamPage;
