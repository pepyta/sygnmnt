import { Authentication } from "@lib/server/auth";
import { UnauthorizedError, UnsupportedMethodError } from "@lib/server/errors";
import { middleware } from "@lib/server/middleware";
import Team from "@lib/server/team";
import { NextApiRequest } from "next";

/**
 * Creates a new team for the given user.
 */
const create = async (req: NextApiRequest) => {
    const user = await Authentication.getUser(req);
    if(!user) throw new UnauthorizedError();

    const name: string = JSON.parse(req.body).name;
    const team = await Team.create(name, user);

    return {
        message: "Team created successfully!",
        team,
    };
};

/**
 * This is the controller for the Team resources.
 */
const controller = async (req: NextApiRequest) => {
    if(req.method === "POST") {
        return await create(req);
    } else {
        throw new UnsupportedMethodError();
    }
};

export default middleware(controller);