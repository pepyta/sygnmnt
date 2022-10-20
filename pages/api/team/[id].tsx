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
    const UUIDregex = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/g
    if(!id || !UUIDregex.test(id)) {
        throw new Error("The team's ID is invalid.");
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
const updateTeamById = async (req: NextApiRequest) => {
    const user = await Authentication.getUser(req);
    if(!user) throw new UnauthorizedError();
    
    const id = req.query.id as string;
    const { name } = JSON.parse(req.body);
    const UUIDregex = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/g
    if(!id || !UUIDregex.test(id)) {
        throw new Error("The team's ID is invalid");
    }
    if(!name || name.length === 0) {
        throw new Error("A team's name must be at least 1 character long!");
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
        throw new Error("Team not found!");
    }
    if(membership.role !== "OWNER") {
        throw new Error("You don't have permission for this!");
    }
    await prisma.team.update({
        where: {
            id: membership.teamId,
        },
        data: {
            name,
        },
    });
    const team = await getTeamById(req);
    return {
        message: "Team successfully updated!",
        team,
    };
};
/**
* This is the controller for the Team resources.
*/
const controller = async (req: NextApiRequest) => {
    if(req.method === "GET") {
        return await getTeamById(req);
    } if(req.method === "PATCH") {
        return await updateTeamById(req);
    } else {
        throw new UnsupportedMethodError();
    }
};

export default middleware(controller);
