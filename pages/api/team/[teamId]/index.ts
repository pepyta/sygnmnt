import { Authentication } from "@lib/server/auth";
import { UnauthorizedError, UnsupportedMethodError } from "@lib/server/errors";
import Membership from "@lib/server/membership";
import { middleware } from "@lib/server/middleware";
import Team from "@lib/server/team";
import { NextApiRequest } from "next";

const updateTeamById = async (req: NextApiRequest) => {
    const user = await Authentication.getUser(req);
    if (!user) throw new UnauthorizedError();
    const { name } = JSON.parse(req.body);

    const teamId = req.query.teamId as string;
    const membership = await Membership.getByTeamId(user, teamId);

    const team = await Team.update(name, membership);

    return {
        message: "Team successfully updated!",
        team,
    };
};

/**
* This is the controller for the Team resources.
*/
const controller = async (req: NextApiRequest) => {
    if (req.method === "PATCH") {
        return await updateTeamById(req);
    } else {
        throw new UnsupportedMethodError();
    }
};

export default middleware(controller);
