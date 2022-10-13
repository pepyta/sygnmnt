import { Authentication } from "@lib/server/auth";
import { MethodNotImplementedError, UnauthorizedError, UnsupportedMethodError } from "@lib/server/errors";
import { middleware } from "@lib/server/middleware";
import prisma from "@lib/server/prisma";
import { NextApiRequest } from "next";

/**
 * Gets a user's teams.
 */
 const getAll = async (req: NextApiRequest) => {
    const user = await Authentication.getUser(req);
    if(!user) throw new UnauthorizedError();

    const memberships = await prisma.membership.findMany({
        where: {
            userId: user.id,
        },
        include: {
            team: true,
        },
    });

    return memberships.map((membership) => membership.team);
};

/**
 * Creates a new team for the given user.
 */
const create = async (req: NextApiRequest) => {
    const user = await Authentication.getUser(req);
    if(!user) throw new UnauthorizedError();
    
    // TODO: Implement this method.
    throw new MethodNotImplementedError();
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