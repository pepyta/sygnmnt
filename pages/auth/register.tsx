import Authentication from "@lib/client/auth";
import { LoadingButton } from "@mui/lab";
import { Card, CardContent, Container, Grid, paperClasses, TextField, Typography } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import { useState } from "react";

const RegisterPage = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [passwordAgain, setPasswordAgain] = useState("");
    const [isLoading, setLoading] = useState(false);
    const router = useRouter();
    const { enqueueSnackbar } = useSnackbar();

    const register = async () => {
        try {
            setLoading(true);
            const { message } = await Authentication.register(username, password);
            router.push("/auth/login");
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
                                Registration
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                autoFocus
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                label={"Username"}
                                autoComplete={"username"}
                                helperText={"Must be at least 5 characters long!"}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                label={"Password"}
                                type={"password"}
                                autoComplete={"new-password"}
                                helperText={"Must be at least 8 characters long!"}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                value={passwordAgain}
                                onChange={(e) => setPasswordAgain(e.target.value)}
                                label={"Password again"}
                                type={"password"}
                                error={password !== passwordAgain}
                                helperText={"It must match with the field above!"}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <LoadingButton
                                disabled={username.length < 5 || password.length < 8 || password !== passwordAgain}
                                onClick={register}
                                fullWidth
                                variant={"contained"}
                                loading={isLoading}
                            >
                                Register
                            </LoadingButton>
                        </Grid>
                        <Grid item xs={12}>
                            Already have an account? <Link href={"/auth/login"}>Log in!</Link>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </Container>
    );
};

export default RegisterPage;