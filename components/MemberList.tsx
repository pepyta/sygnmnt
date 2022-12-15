import { List, ListProps } from "@mui/material";
import { Role } from "@prisma/client";
import { ExtendedTeamType } from "@redux/slices/membership";
import { useMemo } from "react";
import MemberListItem from "./MemberListItem";

export type MemberListProps = ListProps & {
    team: ExtendedTeamType;
};

const MemberList = ({ team, ...props }: MemberListProps) => {
    const memberships = useMemo(
        () => {
            const getAccessLevel = (role: Role) => {
                const map = {
                    OWNER: 3,
                    AUXILIARY: 2,
                    MEMBER: 1,
                };

                return map[role];
            };

            return [...team.memberships].sort((a, b) => getAccessLevel(b.role) - getAccessLevel(a.role));
        },
        [team.memberships],
    );

    return (
        <List {...props}>
            {memberships.map((member) => (
                <MemberListItem
                    key={`member-list-${member.user.id}`}
                    membership={member}
                />
            ))}
        </List>
    );
};

export default MemberList;