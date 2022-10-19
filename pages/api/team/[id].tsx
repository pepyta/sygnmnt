import { Authentication } from "@lib/server/auth";
import { UnauthorizedError, UnsupportedMethodError } from "@lib/server/errors";
import { middleware } from "@lib/server/middleware";
import prisma from "@lib/server/prisma";
import { NextApiRequest } from "next";
import { TeamType } from "../team";

export type GetTeamByIdResponseType = TeamType;

/*
 * Gets single team based on ID - whom the user must be a member of.
 */
const getTeamById = async (req: NextApiRequest): Promise<GetTeamByIdResponseType> => {
    const user = await Authentication.getUser(req);
    if(!user) throw new UnauthorizedError();
    
    const id = req.query.id as string;
    if(!id || id.length !== 36) {
        // TODO: Use regex to determinate if the given ID is a UUID as this feels hacky.
        throw new Error("A team's ID must be exactly 36 characters long!");
    }
    
    const membership = await prisma.membership.findFirst({
        where: {
            userId: user.id,
            teamId: id,
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

    return {
        name: membership.team.name,
        role: membership.role,
        members: membership.team.memberships.map((membership) => ({
            id: membership.user.id,
            username: membership.user.username,
            role: membership.role,
        })),
    };
};

/**
 * This is the controller for the Team resources.
 */
const controller = async (req: NextApiRequest) => {
    if(req.method === "GET") {
        return await getTeamById(req);
    } else {
        throw new UnsupportedMethodError();
    }
};

export default middleware(controller);
