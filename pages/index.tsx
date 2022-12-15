import InvitationCard from "@components/InvitationCard";
import TeamCreateButton from "@components/TeamCreateButton";
import TeamList from "@components/TeamList";
import { useAuth, useUser } from "@components/UserProvider";
import { ExitToAppRounded as LogoutIcon } from "@mui/icons-material";
import { Button, Card, CardActions, CardContent, Container, Grid, Link, Typography } from "@mui/material";
import NextLink from "next/link";

const HomePage = () => {
    const { user } = useUser();
    const { logout } = useAuth();

    const handleLogout = (e) => {
        e.preventDefault();
        logout();
    };

    if (!user) {
        return (
            <Container maxWidth={"sm"}>
                <Card>
                    <CardContent>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Typography variant={"h5"}>
                                    You are not logged in!
                                </Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <NextLink href={"/auth/login"}>Log in!</NextLink>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            </Container>
        );
    }

    return (
        <Container maxWidth={"sm"}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Card>
                        <CardContent>
                            <Typography variant={"h5"} gutterBottom>
                                Hello, {user.username}!
                            </Typography>
                            <Typography>
                                {"You are currently viewing the dashboard of SYGNMNT, an application to create and test students' code submissions."}
                            </Typography>
                            <Typography gutterBottom>
                                
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Button onClick={handleLogout} startIcon={<LogoutIcon />}>
                                Logout
                            </Button>
                        </CardActions>
                    </Card>
                </Grid>
                <Grid item xs={12}>
                    <Card>
                        <CardContent sx={{ pb: 0 }}>
                            <Typography variant={"h5"} gutterBottom>
                                Teams
                            </Typography>
                        </CardContent>
                        <TeamList />
                    </Card>
                </Grid>
                <Grid item xs={12}>
                    <InvitationCard />
                </Grid>
            </Grid>
            <TeamCreateButton
                color={"primary"}
                sx={{
                    position: "fixed",
                    bottom: 0,
                    right: 0,
                    m: 4,
                }}
            />
        </Container>
    );
};

export default HomePage;
