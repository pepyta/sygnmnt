import { Authentication } from "@lib/server/auth";
import { UnauthorizedError, UnsupportedMethodError } from "@lib/server/errors";
import { middleware } from "@lib/server/middleware";
import prisma from "@lib/server/prisma";
import Team from "@lib/server/team";
import { Role } from "@prisma/client";
import { NextApiRequest } from "next";

/**
 * Gets all teams, that the user has membership in.
 */
 const getAll = async (req: NextApiRequest) => {
    const user = await Authentication.getUser(req);
    if(!user) throw new UnauthorizedError();

    // get all memberships of the given user
    const teams = await Team.getAll(user);

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
    const team = await Team.create(name, user);

    return {
        message: "Team created successfully!",
        team,
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