import { Authentication } from "@lib/server/auth";
import { UnauthorizedError, UnsupportedMethodError } from "@lib/server/errors";
import Membership from "@lib/server/membership";
import { middleware } from "@lib/server/middleware";
import Team from "@lib/server/team";
import { NextApiRequest } from "next";

/**
 * Creates a new team for the given user.
 */
const getAll = async (req: NextApiRequest) => {
    const user = await Authentication.getUser(req);
    if(!user) throw new UnauthorizedError();

    const memberships = await Membership.getAll(user);

    return {
        memberships,
    };
};

/**
 * This is the controller for the Team resources.
 */
const controller = async (req: NextApiRequest) => {
    if(req.method === "GET") {
        return await getAll(req);
    } else {
        throw new UnsupportedMethodError();
    }
};

export default middleware(controller);