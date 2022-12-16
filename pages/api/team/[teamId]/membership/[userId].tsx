import { Authentication } from "@lib/server/auth";
import Membership from "@lib/server/membership";
import { middleware } from "@lib/server/middleware";
import { NextApiRequest } from "next";
import prisma from "@lib/server/prisma";
import { ForbiddenError, UnsupportedMethodError } from "@lib/server/errors";

const deleteMembership = async (req: NextApiRequest) => {
    const teamId = req.query.teamId as string;
    const userId = req.query.userId as string;
    
    const user = await Authentication.getUser(req);
    const membership = await Membership.getByTeamId(user, teamId);

    if(membership.role !== "OWNER" && userId !== user.id) throw new ForbiddenError();
    
    if(userId === user.id && membership.role === "OWNER") {
        const isOnlyOwner = membership.team.memberships.filter((membership) => membership.role === "OWNER").length === 1;
        const isOnlyMember = membership.team.memberships.length === 1;

        if(isOnlyOwner && !isOnlyMember) {
            throw new Error("Can't leave this group without having an owner!");
        } else if(isOnlyOwner && isOnlyMember) {
            await prisma.team.delete({
                where: {
                    id: teamId,
                },
            });

            return {
                message: "Group successfully deleted!",
            };
        } else {
            await prisma.membership.delete({
                where: {
                    userId_teamId: {
                        userId: user.id,
                        teamId,
                    },
                },
            });

            return {
                message: "You've successfully left the group!",
            };
        }
    } else {
        await prisma.membership.delete({
            where: {
                userId_teamId: {
                    teamId,
                    userId,
                },
            },
        });

        return {
            message: "Member successfully kicked!",
        };
    }
};

const editMembership = async (req: NextApiRequest) => {
    const teamId = req.query.teamId as string;
    const userId = req.query.userId as string;
    const role = JSON.parse(req.body).role;
    
    const user = await Authentication.getUser(req);
    const membership = await Membership.getByTeamId(user, teamId);

    if(membership.role !== "OWNER") throw new ForbiddenError();
    
    const updatedMembership = await prisma.membership.update({
        where: {
            userId_teamId: {
                teamId,
                userId,
            },
        },
        data: {
            role,
        },
    });

    return {
        message: "Membership successfully edited!",
        membership: updatedMembership,
    };
};



export default middleware(async (req) => {
    if(req.method === "DELETE") {
        return await deleteMembership(req);
    } else if(req.method === "PATCH") {
        return await editMembership(req);
    } else {
        throw new UnsupportedMethodError();
    }
});