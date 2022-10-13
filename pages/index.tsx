import TeamCreateButton from "@components/TeamCreateButton";
import TeamList from "@components/TeamList";
import { useAuth, useUser } from "@components/UserProvider";
import { Card, CardContent, Container, Link, Typography } from "@mui/material";
import NextLink from "next/link";

const HomePage = () => {
    const { user } = useUser();
    const { logout } = useAuth();

    const handleLogout = (e) => {
        e.preventDefault();
        logout();
    };

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

            <Card>
                <CardContent sx={{ pb: 0 }}>
                    <Typography variant={"h5"} gutterBottom>
                        Teams
                    </Typography>
                </CardContent>
                <TeamList />
            </Card>
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
