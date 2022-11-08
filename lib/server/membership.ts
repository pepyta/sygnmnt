import { User } from "@prisma/client";

export default class Membership {
    public static async getByTeamId(user: User, teamId: string) {
        const membership = await prisma.membership.findUnique({
            where: {
                userId_teamId: {
                    teamId,
                    userId: user.id,
                },
            },
            include: {
                team: {
                    include: {
                        memberships: {
                            include: {
                                user: true,
                            },
                        },
                    },
                },
            },
        });
        
        if(!membership) {
            throw new Error("This team does not exist or you are not a member of it!");
        }

        return membership;
    }
}