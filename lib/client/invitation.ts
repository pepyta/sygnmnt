import * as Prisma from "@prisma/client";
import { InvitationActions } from "@redux/slices/invitation";
import { TeamInvitationActions } from "@redux/slices/teamInvitation";
import store from "redux/store";
import Authentication from "./auth";
import RootApiHandler from "./fetch";
import Membership from "./membership";

export type InvitationType = Prisma.Invitation & {
    team: Prisma.Team;
};

export type TeamInvitationType = Prisma.Invitation & {
    username: string;
};

export default class Invitation {
    /**
     * Rejects an invitation to a team.
     */
    public static async revoke(teamId: string, userId: string) {
        await RootApiHandler.getResponse(`/api/team/${teamId}/invitations`, {
            method: "POST",
            body: JSON.stringify({
                userId,
            }),
            headers: {
                "Authorization": `Bearer ${Authentication.getAccessToken()}`,
            },
        });

        await Invitation.getTeamAll(teamId);
    }
    /**
     * Gets all of the invitations to a team from the server as an array.
     */
    public static async getTeamAll(teamId: string): Promise<TeamInvitationType[]> {
        try {
            store.dispatch(TeamInvitationActions.setLoading(true));
            const teamInvitations = await RootApiHandler.fetch(`/api/team/${teamId}/invitations`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${Authentication.getAccessToken()}`,
                },
            });
            store.dispatch(TeamInvitationActions.setLoading(false));
            store.dispatch(TeamInvitationActions.setTeamInvitations(teamInvitations));    
            return teamInvitations;
        } catch(e) {
            store.dispatch(TeamInvitationActions.setLoading(false));
            throw e;
        }
    }
    
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
        const result = await RootApiHandler.fetch(`/api/team/${teamId}/member`, {
            method: "POST",
            body: JSON.stringify({
                username,
            }),
            headers: {
                "Authorization": `Bearer ${Authentication.getAccessToken()}`,
            },
        });
        
        await Invitation.getTeamAll(teamId);
        
        return result;
    }
}