import { List, ListItem, ListItemProps, ListItemText, ListProps } from "@mui/material";
import { Membership, User } from "@prisma/client";

export type MemberListItemProps = ListItemProps & {
    membership: Membership & {
        user: Omit<User, "password">;
    };
};

const MemberListItem = ({ membership, ...props }: MemberListItemProps) => {
    return (
        <ListItem {...props}>
            <ListItemText
                primary={membership.user.username}
                secondary={`Role: ${membership.role}`}
            />
        </ListItem>
    );
};

export default MemberListItem;