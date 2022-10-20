import { useUser, useAuth } from "@components/UserProvider";
import { LoadingButton } from "@mui/lab";
import { Box, Button, Card, CardContent, Container, Grid, TextField, Typography } from "@mui/material";
import NextLink from "next/link";
import Link from "next/link";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import { useState } from "react";

const LoginPage = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setLoading] = useState(false);
    const router = useRouter();
    const { enqueueSnackbar } = useSnackbar();
    const Authentication = useAuth();

    const { user } = useUser();

    if(user){
        return (
            <Container maxWidth={"sm"}>
                <Card>
                    <CardContent>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Typography variant={"h5"}>
                                    You are already logged in!
                                </Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <NextLink href={"/"}>Jump to home page</NextLink>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            </Container>
        );
    }

    const login = async () => {
        try {
            setLoading(true);
            const { message } = await Authentication.login(username, password);
            router.push("/");
            enqueueSnackbar(message, {
                variant: "success",
            });
        } catch (e) {
            setLoading(false);
            if (e instanceof Error) {
                enqueueSnackbar(e.message, {
                    variant: "error",
                });
            }
        }
    };

    return (
        <Container maxWidth={"sm"} sx={{ mt: 4, mb: 4 }}>
            <Card>
                <CardContent>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Typography variant={"h5"}>
                                Authentication
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                label={"Username"}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                label={"Password"}
                                type={"password"}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <LoadingButton onClick={login} fullWidth variant={"contained"} loading={isLoading}>
                                Login
                            </LoadingButton>
                        </Grid>
                        <Grid item xs={12}>
                            Do you want to create a new user? <Link href={"/auth/register"}>Register!</Link>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </Container>
    );
};

export default LoginPage;
