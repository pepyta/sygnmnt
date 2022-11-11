import { Authentication } from "@lib/server/auth";
import { ForbiddenError, UnauthorizedError, UnsupportedMethodError } from "@lib/server/errors";
import Membership from "@lib/server/membership";
import { middleware } from "@lib/server/middleware";
import prisma from "@lib/server/prisma";
import Team from "@lib/server/team";
import { NextApiRequest } from "next";

/*
* Gets single team based on ID - whom the user must be a member of.
*/
const getTeamById = async (req: NextApiRequest) => {
    const user = await Authentication.getUser(req);
    if (!user) throw new UnauthorizedError();

    const teamId = req.query.id as string;

    const membership = await Membership.getByTeamId(user, teamId);

    return {
        id: membership.team.id,
        name: membership.team.name,
        role: membership.role,
        members: membership.team.memberships.map((membership) => ({
            id: membership.user.id,
            username: membership.user.username,
            role: membership.role,
        })),
    };
};

const updateTeamById = async (req: NextApiRequest) => {
    const user = await Authentication.getUser(req);
    if (!user) throw new UnauthorizedError();
    const { name } = JSON.parse(req.body);

    const teamId = req.query.id as string;
    const membership = await Membership.getByTeamId(user, teamId);

    const team = await Team.update(name, membership);

    return {
        message: "Team successfully updated!",
        team,
    };
};

/**
* This is the controller for the Team resources.
*/
const controller = async (req: NextApiRequest) => {
    if (req.method === "GET") {
        return await getTeamById(req);
    } if (req.method === "PATCH") {
        return await updateTeamById(req);
    } else {
        throw new UnsupportedMethodError();
    }
};

export default middleware(controller);
