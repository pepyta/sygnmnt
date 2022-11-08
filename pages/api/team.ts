import { Authentication } from "@lib/server/auth";
import { UnauthorizedError, UnsupportedMethodError } from "@lib/server/errors";
import { middleware } from "@lib/server/middleware";
import prisma from "@lib/server/prisma";
import { Role } from "@prisma/client";
import { NextApiRequest } from "next";

export type TeamType = {
    name: string;
    role: Role;
    members: TeamMemberType[];
};

export type TeamMemberType = {
    id: string;
    username: string;
    role: Role;
};

/**
 * Gets all teams, that the user has membership in.
 */
 const getAll = async (req: NextApiRequest) => {
    const user = await Authentication.getUser(req);
    if(!user) throw new UnauthorizedError();

    // get all memberships of the given user
    const memberships = await prisma.membership.findMany({
        where: {
            userId: user.id,
        },
        include: {
            team: true,
        },
    });

    // return only the team objects, exclude additional informations from membership
    const teams = memberships.map((membership) => membership.team);

    return {
        teams,
    };
};

/**
 * Creates a new team for the given user.
 */
const create = async (req: NextApiRequest) => {
    const user = await Authentication.getUser(req);
    if(!user) throw new UnauthorizedError();

    const name: string = JSON.parse(req.body).name;
    if(!name || name.length === 0) {
        throw new Error("A team's name must be at least one character long!");
    }

    const membership = await prisma.membership.create({
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

    return {
        message: "Team created successfully!",
        team: membership.team,
    };
};

/**
 * This is the controller for the Team resources.
 */
const controller = async (req: NextApiRequest) => {
    if(req.method === "GET") {
        return await getAll(req);
    } else if(req.method === "POST") {
        return await create(req);
    } else {
        throw new UnsupportedMethodError();
    }
};

export default middleware(controller);