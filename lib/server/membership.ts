import { User } from "@prisma/client";
import { ExtendedMembershipType } from "@redux/slices/membership";

export default class Membership {
    public static async getByTeamId(user: User, teamId: string) {
        const memberships = await Membership.getAll(user);
        return memberships.find((membership) => membership.team.id === teamId);
    }

    /**
     * This method queries all of the memberships with all possibly needed additional informations.
     * @param user The user that wants to get the membership informations.
     * @returns An array of extended membership informations.
     */
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
                                submissions: {
                                    include: {
                                        files: true,
                                        user: true,
                                    },
                                    // this large where functions basically filters to all submissions that has been submitted by the user or if the user an owner/auxilliary of the group, then return all
                                    where: {
                                        OR: [
                                            {
                                                task: {
                                                    team: {
                                                        memberships: {
                                                            some: {
                                                                OR: [
                                                                    {
                                                                        userId: user.id,
                                                                        role: "OWNER",
                                                                    },
                                                                    {
                                                                        userId: user.id,
                                                                        role: "AUXILIARY",
                                                                    },
                                                                ]
                                                            }
                                                        }
                                                    }
                                                }
                                            },
                                            {
                                                userId: user.id,
                                            }
                                        ]
                                    },
                                },
                            },
                        },
                    },
                }
            },
        });
    }
}