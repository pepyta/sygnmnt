import { User } from "@prisma/client";

const UUIDregex = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/g

export class Membership {
    public async getByTeamId(user: User, teamId: string) {
        if(!teamId || !UUIDregex.test(teamId)) {
            throw new Error("The team's ID is invalid.");
        }
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

if(!global.Membership) {
    global.Membership = new Membership();
}

export default global.Membership as Membership;