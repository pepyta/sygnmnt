import { Authentication } from "@lib/server/auth";
import { ForbiddenError, TeamNotFoundError, UnauthorizedError, UnsupportedMethodError } from "@lib/server/errors";
import Invitation from "@lib/server/invitation";
import Membership from "@lib/server/membership";
import { middleware } from "@lib/server/middleware";
import prisma from "@lib/server/prisma";
import { NextApiRequest } from "next";

/**
 * This is the controller for the Team's invitations.
 */
const getTeamInvitations = async (req: NextApiRequest): Promise<TeamInvitationType[]> => {
    // get the team that we want to list the members of
    const teamId = req.query.teamId as string;
    // get the user
    const user = await Authentication.getUser(req);
    if (!user) throw new UnauthorizedError();

    const membership = await Membership.getByTeamId(user, teamId);

    if(!membership || membership.role === "MEMBER") {
        throw new ForbiddenError();
    }

    return await Invitation.getTeamAll(membership.team);
};

/**
 * This is the controller for revoking a Team invitation.
 */
const revokeTeamInvitation = async (req: NextApiRequest) => {
    // get the team that we want to remove a invitation of
    const teamId = req.query.teamId as string;
    // get the user
    const user = await Authentication.getUser(req);
    if (!user) throw new UnauthorizedError();

    const membership = await Membership.getByTeamId(user, teamId);

    if(!membership || membership.role === "MEMBER") {
        throw new ForbiddenError();
    }

    const { userId } = JSON.parse(req.body);
    const target = await prisma.user.findUnique({
        where: {
            id: userId,
        },
    });
    Invitation.revoke(membership.team, target);
};

export default middleware(async (req) => {
    if(req.method === "GET") {
        return await getTeamInvitations(req);
    } else if(req.method === "POST") {
        return await revokeTeamInvitation(req);
    } else {
        throw new UnsupportedMethodError();
    }
});