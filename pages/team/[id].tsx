import { Container } from "@mui/material";

export type TeamPageProps = {
    id: string;
};

const TeamPage = ({ id }: TeamPageProps) => {
    return (
        <Container maxWidth={"sm"}>
            This is the team page for {id}.
        </Container>
    );
};

TeamPage.getInitialProps = ({ query }) => {
    return {
        id: query.id,
    };
};

export default TeamPage;