import * as Prisma from "@prisma/client";
import { InvitationActions } from "@redux/slices/invitation";
import store from "redux/store";
import Authentication from "./auth";
import RootApiHandler from "./fetch";
import Membership from "./membership";

export type InvitationType = Prisma.Invitation & {
    team: Prisma.Team;
};

export default class Invitation {
    /**
     * Gets all of the invitations from the server as an array.
     */
    public static async getAll(): Promise<InvitationType[]> {
        try {
            store.dispatch(InvitationActions.setLoading(true));

            const invitations = await RootApiHandler.fetch("/api/invitation", {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${Authentication.getAccessToken()}`,
                },
            });
    
            store.dispatch(InvitationActions.setLoading(false));
            store.dispatch(InvitationActions.setInvitations(invitations));    
            return invitations;
        } catch(e) {
            store.dispatch(InvitationActions.setLoading(false));
            throw e;
        }
    }

    /**
     * Accepts an invitation to a team.
     */
    public static async acceptInvitation(teamId: string) {
        await RootApiHandler.fetch(`/api/team/${teamId}/member`, {
            method: "PATCH",
            headers: {
                "Authorization": `Bearer ${Authentication.getAccessToken()}`,
            },
        });

        await Promise.all([
            Membership.getAll(),
            Invitation.getAll(),
        ]);
    }

    /**
     * Rejects an invitation to a team.
     */
    public static async rejectInvitation(teamId: string) {
        await RootApiHandler.fetch(`/api/team/${teamId}/member`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${Authentication.getAccessToken()}`,
            },
        });

        await Invitation.getAll();
    }

    /**
     * Invites a user to the team.
     */
    public static async inviteUser(teamId: string, username: string) {
        return await RootApiHandler.fetch(`/api/team/${teamId}/member`, {
            method: "POST",
            body: JSON.stringify({
                username,
            }),
            headers: {
                "Authorization": `Bearer ${Authentication.getAccessToken()}`,
            },
        });
    }
}