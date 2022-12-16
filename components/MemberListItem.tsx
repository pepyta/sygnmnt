import Membership from "@lib/client/membership";
import { MoreVertRounded, PersonOffRounded, StarOutlineRounded, StarRounded } from "@mui/icons-material";
import { IconButton, List, ListItem, ListItemAvatar, ListItemIcon, ListItemProps, ListItemSecondaryAction, ListItemText, ListProps, Menu, MenuItem } from "@mui/material";
import * as Prisma from "@prisma/client";
import { useMemberships } from "@redux/slices/membership";
import { useSnackbar } from "notistack";
import { useCallback, useMemo, useState } from "react";
import UserAvatar from "./UserAvatar";
import { useUser } from "./UserProvider";

export type MemberListItemProps = ListItemProps & {
    membership: Prisma.Membership & {
        user: Omit<Prisma.User, "password">;
    };
};

const MemberListItem = ({ membership, ...props }: MemberListItemProps) => {
    const [isLoading, setLoading] = useState(false);
    const { enqueueSnackbar } = useSnackbar();
    const [contextMenu, setContextMenu] = useState<{
        mouseX: number;
        mouseY: number;
    } | null>(null);

    const { user } = useUser();
    const { memberships } = useMemberships();
    const ownMembership = useMemo(
        () => memberships.find((el) => el.userId === user.id && el.teamId === membership.teamId),
        [membership.teamId, memberships, user.id],
    );

    const handleContextMenu = (event: React.MouseEvent) => {
        event.preventDefault();
        setContextMenu(
            contextMenu === null
                ? {
                    mouseX: event.clientX + 2,
                    mouseY: event.clientY - 6,
                }
                : // repeated contextmenu when it is already open closes it with Chrome 84 on Ubuntu
                // Other native context menus might behave different.
                // With this behavior we prevent contextmenu from the backdrop to re-locale existing context menus.
                null,
        );
    };

    const handleClose = () => {
        setContextMenu(null);
    };

    const handleKick = useCallback(
        async () => {
            try {
                setLoading(true);
    
                const { message } = await Membership.kick(membership.teamId, membership.userId);
                enqueueSnackbar(message, {
                    variant: "success",
                });
                handleClose();
                
                setLoading(false);
            } catch(e) {
                setLoading(false);
                enqueueSnackbar(e.message, {
                    variant: "error",
                });
            }
        },
        [enqueueSnackbar, membership.teamId, membership.userId],
    );
    
    const handleRoleChange = useCallback(
        async (role: Prisma.Role) => {
            try {
                setLoading(true);
    
                const { message } = await Membership.edit(membership.teamId, membership.userId, role);
                enqueueSnackbar(message, {
                    variant: "success",
                });
                handleClose();
    
                setLoading(false);
            } catch(e) {
                setLoading(false);
                enqueueSnackbar(e.message, {
                    variant: "error",
                });
            }
        },
        [enqueueSnackbar, membership.teamId, membership.userId],
    );

    const items = useMemo(
        () => {
            const options: JSX.Element[] = [];

            if(ownMembership.role === "OWNER" && membership.userId !== user.id) {
                options.push(
                    <MenuItem onClick={handleKick} disabled={isLoading}>
                        <ListItemIcon>
                            <PersonOffRounded fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>Kick</ListItemText>
                    </MenuItem>
                );

                if(membership.role === "MEMBER") {
                    options.push(
                        <MenuItem onClick={() => handleRoleChange("AUXILIARY")} disabled={isLoading}>
                            <ListItemIcon>
                                <StarRounded fontSize="small" />
                            </ListItemIcon>
                            <ListItemText>Promote to auxillary</ListItemText>
                        </MenuItem>
                    );
                } else if(membership.role === "AUXILIARY") {
                    options.push(
                        <MenuItem onClick={() => handleRoleChange("OWNER")} disabled={isLoading}>
                            <ListItemIcon>
                                <StarRounded fontSize="small" />
                            </ListItemIcon>
                            <ListItemText>Promote to owner</ListItemText>
                        </MenuItem>
                    );

                    options.push(
                        <MenuItem onClick={() => handleRoleChange("MEMBER")} disabled={isLoading}>
                            <ListItemIcon>
                                <StarOutlineRounded fontSize="small" />
                            </ListItemIcon>
                            <ListItemText>Demote to member</ListItemText>
                        </MenuItem>
                    );
                } else if(membership.role === "OWNER") {
                    options.push(
                        <MenuItem onClick={() => handleRoleChange("AUXILIARY")} disabled={isLoading}>
                            <ListItemIcon>
                                <StarOutlineRounded fontSize="small" />
                            </ListItemIcon>
                            <ListItemText>Demote to auxillary</ListItemText>
                        </MenuItem>
                    );
                }
            }

            if(membership.userId === user.id) {
                options.push(
                    <MenuItem onClick={handleKick} disabled={isLoading}>
                        <ListItemIcon>
                            <PersonOffRounded fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>Leave group</ListItemText>
                    </MenuItem>
                );
            }

            return options;
        },
        [handleKick, handleRoleChange, isLoading, membership.role, membership.userId, ownMembership.role, user.id],
    );

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
            <ListItemSecondaryAction>
                {items.length > 0 && (
                    <IconButton onClick={handleContextMenu}>
                        <MoreVertRounded />
                    </IconButton>
                )}
                <Menu
                    open={contextMenu !== null}
                    onClose={handleClose}
                    anchorReference="anchorPosition"
                    anchorPosition={
                        contextMenu !== null
                            ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
                            : undefined
                    }
                >
                    {items}
                </Menu>
            </ListItemSecondaryAction>
        </ListItem>
    );
};

export default MemberListItem;