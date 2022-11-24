import { InvitationType } from "@lib/client/invitation";
import { Authentication } from "@lib/server/auth";
import { UnsupportedMethodError } from "@lib/server/errors";
import Invitation from "@lib/server/invitation";
import { middleware } from "@lib/server/middleware";
import { NextApiRequest } from "next";

const getInvitations = async (req: NextApiRequest): Promise<InvitationType[]> => {
    const user = await Authentication.getUser(req);

    return await Invitation.getAll(user);
};

export default middleware(async (req) => {
    if(req.method === "GET") {
        return await getInvitations(req);
    } else {
        throw new UnsupportedMethodError();
    }
});