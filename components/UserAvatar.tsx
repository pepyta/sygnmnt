import { Avatar, AvatarProps, useTheme } from "@mui/material";
import { User } from "@prisma/client";

export type UserAvatarProps = AvatarProps & {
    user: Omit<User, "password">;
};

const UserAvatar = ({ user, ...props }: UserAvatarProps) => {
    const theme = useTheme();

    return (
        <Avatar {...props} sx={{ backgroundColor: theme.palette.primary.main, ...props.sx }}>
            {user.username.trim().length > 0
                ? user.username.trim().charAt(0).toUpperCase()
                : "?"}
        </Avatar>
    );
};

export default UserAvatar;