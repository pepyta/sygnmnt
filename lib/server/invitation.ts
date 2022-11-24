import { InvitationType } from "@lib/client/invitation";
import Prisma from "@prisma/client";
import { AlreadyMemberError, InvitationNotFoundError } from "./errors";

export default class Invitation {
    /**
     * Gets all of the invitations for a given user to a team.
     * @param user The user that wants to get the invitations.
     * @returns The invitations as an array.
     */
    public static async getAll(user: Prisma.User): Promise<InvitationType[]> {
        return await prisma.invitation.findMany({
            where: {
                userId: user.id,
            },
            include: {
                team: true,
            },
        });
    }

    /**
     * Creates a new invitation for the given team and user.
     * @param team The team that we want to invite the team to.
     * @param user The user that we want to invite.
     * @returns The invitation that has been created.
     */
    public static async inviteUser(team: Prisma.Team, user: Prisma.User): Promise<Prisma.Invitation> {
        // check if we want to invite a user that is already a member of the team
        const member = await prisma.membership.findUnique({
            where: {
                userId_teamId: {
                    userId: user.id,
                    teamId: team.id,
                },
            },
        });

        if (member) {
            throw new AlreadyMemberError();
        }

        const pendingInvitation = await this.findPendingInvitation(user, team);
        // if there is already a pending invitation, do nothing
        if (pendingInvitation) {
            return pendingInvitation;
        }

        const invitation = await prisma.invitation.create({
            data: {
                teamId: team.id,
                userId: user.id,
            },
        });

        return invitation;
    };

    /**
     * Rejects the invitation as a user.
     * @param user The user that want to invitation.
     * @param team The team that it wants to reject it's invitation.
     */
    public static async rejectInvitation(user: Prisma.User, team: Prisma.Team) {
        const pendingInvitation = await this.findPendingInvitation(user, team);
        if(!pendingInvitation) {
            throw new InvitationNotFoundError();
        }

        await Invitation.deleteInvitation(pendingInvitation);
    }

    /**
     * Accepts an invitation as a user.
     * @param user The user that wants to accept the invitation.
     * @param team The team that it wants accept it's invitation.
     */
    public static async acceptInvitation(user: Prisma.User, team: Prisma.Team) {
        const pendingInvitation = await this.findPendingInvitation(user, team);
        if(!pendingInvitation) {
            throw new InvitationNotFoundError();
        }

        const membership = await prisma.membership.create({
            data: {
                user: {
                    connect: {
                        id: user.id,
                    },
                },
                team: {
                    connect: {
                        id: team.id,
                    },
                },
                role: "MEMBER",
            },
        });

        await Invitation.deleteInvitation(pendingInvitation);
    }

    /**
     * Deletes an invitation from the database as it has been accepted or rejected.
     * @param invitation The invitation object.
     */
    private static async deleteInvitation(invitation: Prisma.Invitation) {
        await await prisma.invitation.delete({
            where: {
                userId_teamId: {
                    userId: invitation.userId,
                    teamId: invitation.teamId,
                },
            },
        });
    }

    /**
     * Finds a pending invitation for a given user and a team.
     * @param user The user that is looking for the invitation.
     * @param team The team that it wants to check the invitation for.
     * @returns The invitation object or null if not found.
     */
    private static async findPendingInvitation(user: Prisma.User, team: Prisma.Team) {
        return await prisma.invitation.findUnique({
            where: {
                userId_teamId: {
                    userId: user.id,
                    teamId: team.id,
                },
            },
        });
    };

}