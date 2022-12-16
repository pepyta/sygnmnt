import { ExtendedMembershipType, MembershipActions } from "@redux/slices/membership";
import store from "@redux/store";
import Authentication from "./auth";
import RootApiHandler from "./fetch";
import * as Prisma from "@prisma/client";

const Membership = {
    getAll: async (): Promise<ExtendedMembershipType[]> => {
        try {
            store.dispatch(MembershipActions.setLoading(true));

            const { memberships } = await RootApiHandler.fetch("/api/membership", {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${Authentication.getAccessToken()}`,
                },
            });
    
            store.dispatch(MembershipActions.setLoading(false));
            store.dispatch(MembershipActions.setMemberships(memberships));
            return memberships;
        } catch(e) {
            store.dispatch(MembershipActions.setLoading(false));
            throw e;
        }
    },

    kick: async (teamId: string, userId: string) => {
        const response = await RootApiHandler.fetch(`/api/team/${teamId}/membership/${userId}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${Authentication.getAccessToken()}`,
            },
        });

        await Membership.getAll();

        return response;
    },

    edit: async (teamId: string, userId: string, role: Prisma.Role) => {
        const response = await RootApiHandler.fetch(`/api/team/${teamId}/membership/${userId}`, {
            method: "PATCH",
            body: JSON.stringify({
                role,
            }),
            headers: {
                "Authorization": `Bearer ${Authentication.getAccessToken()}`,
            },
        });

        await Membership.getAll();

        return response;
    },
};

export default Membership;
