import { User } from "@prisma/client";
import { ExtendedMembershipType } from "@redux/slices/membership";

export default class Membership {
    public static async getByTeamId(user: User, teamId: string) {
        const memberships = await Membership.getAll(user);
        return memberships.find((membership) => membership.team.id === teamId);
    }

    public static async getAll(user: User): Promise<ExtendedMembershipType[]> {
        return await prisma.membership.findMany({
            where: {
                userId: user.id,
            },
            include: {
                team: {
                    include: {
                        memberships: {
                            include: {
                                user: true,
                            },
                        },
                        tasks: {
                            include: {
                                files: true,
                            },
                        },
                    },
                }
            },
        });
    }
}