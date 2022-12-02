import { Avatar, AvatarProps } from "@mui/material";
import { User } from "@prisma/client";

export type UserAvatarProps = AvatarProps & {
    user: Omit<User, "password">;
};

const UserAvatar = ({ user, ...props }: UserAvatarProps) => (
    <Avatar {...props}>
        {user.username.trim().length > 0
            ? user.username.trim().charAt(0)
            : "?"}
    </Avatar>
);

export default UserAvatar;