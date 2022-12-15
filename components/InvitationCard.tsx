import { Card, CardProps, Typography } from "@mui/material";
import InvitationList from "./InvitationList";

export type InvitationCardProps = CardProps;

const InvitationCard = (props: InvitationCardProps) => {
    return (
        <Card {...props}>
            <Typography variant={"h5"} sx={{ pl: 2, pr: 2, pt: 2 }}>
                Pending invitations
            </Typography>
            <InvitationList />
        </Card>
    );
};

export default InvitationCard;