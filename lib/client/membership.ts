import { ExtendedMembershipType, MembershipActions } from "@redux/slices/membership";
import store from "@redux/store";
import Authentication from "./auth";
import RootApiHandler from "./fetch";

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
};

export default Membership;
