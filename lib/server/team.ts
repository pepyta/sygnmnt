import { Role, Team as PrismaTeam, User, Membership as PrismaMembership } from "@prisma/client";
import { ForbiddenError } from "./errors";
import prisma from "./prisma";

export type GetTeamByIdResponseType = {
    id: string;
    name: string;
    role: Role;
    members: TeamMemberType[];
};

export type TeamMemberType = {
    id: string;
    username: string;
    role: Role;
};

export default class Team {
    /**
     * Creates a new team.
     * @param name The name of the team.
     * @param user That wants to create the team.
     * @returns The team that has been created.
     */
    public static async create(name: string, user: User): Promise<PrismaTeam> {
        if (!name || name.length === 0) {
            throw new Error("A team's name must be at least one character long!");
        }

        const { team } = await prisma.membership.create({
            data: {
                user: {
                    connect: {
                        id: user.id,
                    },
                },
                team: {
                    create: {
                        name,
                    },
                },
                role: "OWNER",
            },
            include: {
                team: true,
            },
        });

        return team;
    }

    /**
     * Adds a new user to an existing team.
     * @param user The user to be added.
     * @param team The team the user should be added to.
     * @param role The role of the user in the existing team.
     */
    public static async addMember(user: User, team: PrismaTeam, role: Role) {
        if (role === Role.OWNER)
            throw new ForbiddenError();
        await prisma.membership.create({
            data: {
                userId: user.id,
                teamId: team.id,
                role: role,
            }
        });
    }

    /**
     * Gets all of the teams for a given user.
     * @param user The user that we want to get the teams for.
     * @returns An array of teams.
     */
    public static async getAll(user: User) {
        const memberships = await prisma.membership.findMany({
            where: {
                userId: user.id,
            },
            include: {
                team: true,
            },
        });

        // return only the team objects, exclude additional informations from membership
        return memberships.map((membership) => membership.team);
    }

    public static async update(name: string, membership: PrismaMembership) {
        if (!name || name.length === 0) {
            throw new Error("A team's name must be at least 1 character long!");
        }

        if (membership.role !== "OWNER") {
            throw new ForbiddenError();
        }

        const team = await prisma.team.update({
            where: {
                id: membership.teamId,
            },
            data: {
                name,
            },
        });

        return team;
    }
}
