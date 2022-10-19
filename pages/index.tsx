import { useAuth, useUser } from "@components/UserProvider";
import { Container, Link } from "@mui/material";
import NextLink from "next/link";
import { Dialog, DialogActions, DialogContent, DialogTitle, DialogContentText } from '@mui/material';
import { useState } from "react";
import { TextField } from '@mui/material';
import Authentication from "@lib/client/auth";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";

const HomePage = () => {
    const { user } = useUser();
    const { logout } = useAuth();
    const [teamName, setTeamName] = useState("");
    const [isLoading, setLoading] = useState(false);
    const router = useRouter();
    const { enqueueSnackbar } = useSnackbar();

    const handleLogout = (e) => {
        e.preventDefault();
        logout();
    };
    const createTeam = async () => {
        try {
            setLoading(true);
            const { message } = await Authentication.createTeam(teamName);
            router.push("index");
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
    }

    if(!user) {
        return (
            <Container maxWidth={"sm"}>
                You are not logged in! <NextLink href={"/auth/login"}>Log in!</NextLink>
            </Container>
        );
    }

    return (
        <Container maxWidth={"sm"}>
            Hello, {user.username}! <Link
                href={"#"}
                onClick={handleLogout}
            >Logout</Link>
        </Container><Container maxWidth={"sm"}>
        <Button onClick={() => setOpen(true)}> Create team </Button>
        <Dialog
            fullWidth
            maxWidth = 'xs'
            open = {open}
            onClose = {() => setOpen(false)}
                aria-labelledby='dialog-title'
                aria-describedby='dialog-description'
            >
                <DialogTitle id='dialog-title' align="center">Creating new team</DialogTitle>
                <DialogContent>
                    <DialogContentText id='diaog-description'> Please enter your team name</DialogContentText>
                    <TextField
                        fullWidth
                        autoFocus
                        value={teamName}
                        onChange={(e) => setTeamName(e.target.value)}
                        label={"Team-name"}
                        />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Cancel</Button>
                    <Button autoFocus onClick={createTeam}>Create</Button>
                </DialogActions>
            </Dialog>
            </Container></>
    );
};

export default HomePage;
