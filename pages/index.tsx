import { useAuth, useUser } from "@components/UserProvider";
import { Container, Link } from "@mui/material";
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
        </Container>
    );
};

export default HomePage;
