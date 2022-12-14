import { Authentication } from "@lib/server/auth";
import { ForbiddenError, TeamNotFoundError, UnauthorizedError, UnsupportedMethodError } from "@lib/server/errors";
import Invitation from "@lib/server/invitation";
import Membership from "@lib/server/membership";
import { middleware } from "@lib/server/middleware";
import prisma from "@lib/server/prisma";
import { NextApiRequest } from "next";

/**
* This is the controller for the Team resources.
*/
const controller = async (req: NextApiRequest) => {
    const teamId = req.query.teamId as string;
    const user = await Authentication.getUser(req);
    if (!user) throw new UnauthorizedError();

    if (req.method === "POST") {
        const { username } = JSON.parse(req.body); 
        const membership = await Membership.getByTeamId(user, teamId);

        if(!membership || membership.role === "MEMBER") {
            throw new ForbiddenError();
        }

        const target = await prisma.user.findUnique({
            where: {
                username,
            },
        });

        // don't throw error when no user is found with a given name as that would be a potential security risk
        if(!target) return;
    
        await Invitation.inviteUser(membership.team, target);

        return {
            message: "Invitation successfully sent!",
        };
    } else {
        const team = await prisma.team.findUnique({
            where: {
                id: teamId,
            },
        });

        if(!team) {
            throw new TeamNotFoundError();
        }

        if (req.method === "PATCH") {
            await Invitation.acceptInvitation(user, team);

            return {
                message: "Invitation successfully accepted!",
            };
        } else if(req.method === "DELETE") {
            await Invitation.rejectInvitation(user, team);
            return {
                message: "Invitation successfully rejected!",
            };
        } else {
            throw new UnsupportedMethodError();
        }
    }
};

export default middleware(controller);
