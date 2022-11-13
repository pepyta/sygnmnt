import TaskCreateFab from "@components/TaskCreateFab";
import TaskList from "@components/TaskList";
import { useUser } from "@components/UserProvider";
import Team from "@lib/client/team";
import { useMount } from "@lib/client/useMount";
import { LoadingButton } from "@mui/lab";
import { Card, CardContent, Container, Grid, Typography } from "@mui/material";
import { Task as PrismaTask } from "@prisma/client";
import NextLink from "next/link";
import { useState } from "react";
import Task from "@lib/client/task";
import { GetTeamByIdResponseType } from "@lib/server/team";

export type TeamPageProps = {
    id: string;
};

const TeamPage = ({ id }: TeamPageProps) => {
    const { user } = useUser();
    const [isLoading, setLoading] = useState(true);
    const [error, setError] = useState<Error>();
    const [team, setTeam] = useState<GetTeamByIdResponseType>();
    const [tasks, setTasks] = useState<PrismaTask[]>();
    
    const load = async () => {
        setLoading(true);

        try {
            const [team, tasks] = await Promise.all([
                Team.getByID(id),
                Task.getAll(id),
            ]);

            setTeam(team);
            setTasks(tasks);

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
        <Container maxWidth={"sm"} sx={{ pt: 2, pb: 2}}>
            <Card>
                <CardContent sx={{ pb: 0 }}>
                    <Typography variant={"h5"}>
                        Tasks
                    </Typography>
                </CardContent>
                <TaskList
                    tasks={tasks}
                    team={team}
                />
            </Card>
            <TaskCreateFab
                sx={{ position: "fixed", bottom: 0, right: 0, m: 4 }}
                color={"primary"}
                team={team}
                onCreate={load}
            />
        </Container>
    );
};

TeamPage.getInitialProps = ({ query }) => {
    return {
        id: query.id,
    };
};

export default TeamPage;
