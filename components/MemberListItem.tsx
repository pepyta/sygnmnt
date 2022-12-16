import { List, ListItem, ListItemAvatar, ListItemProps, ListItemText, ListProps } from "@mui/material";
import { Membership, User } from "@prisma/client";
import UserAvatar from "./UserAvatar";

export type MemberListItemProps = ListItemProps & {
    membership: Membership & {
        user: Omit<User, "password">;
    };
};

const MemberListItem = ({ membership, ...props }: MemberListItemProps) => {
    return (
        <ListItem {...props}>
            <ListItemAvatar>
                <UserAvatar
                    user={membership.user}
                />
            </ListItemAvatar>
            <ListItemText
                primary={membership.user.username}
                secondary={`Role: ${membership.role}`}
            />
        </ListItem>
    );
};

export default MemberListItem;