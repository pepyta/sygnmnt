import { Authentication } from "@lib/server/auth";
import { ForbiddenError, UnsupportedMethodError } from "@lib/server/errors";
import Membership from "@lib/server/membership";
import { middleware } from "@lib/server/middleware";
import Task from "@lib/server/task";
import { ProgrammingLanguage } from "@prisma/client";
import { NextApiRequest } from "next";

const createTask = async (req: NextApiRequest) => {
    // get the user
    const user = await Authentication.getUser(req);

    // get the team that we want to create the task for
    const teamId = req.query.teamId as string;
    const membership = await Membership.getByTeamId(user, teamId);

    // only owners and auxiliaries can create new task
    if(membership.role !== "OWNER" && membership.role !== "AUXILIARY") {
        throw new ForbiddenError();
    }

    // verify parameters
    const { name, dueDate, hardDeadline, description, language, files } = JSON.parse(req.body);
    if(!name || name.length === 0) throw new Error("You must set a name for the task!");
    if(!description || description.length === 0) throw new Error("You must set a description for the task!");
    const programmingLanguage: ProgrammingLanguage = language === "C" ? "C" : "CPP";

    const task = await Task.create(membership.team, name, new Date(dueDate*1000), hardDeadline, description, programmingLanguage, files);

    return {
        message: "Task successfully created!",
        task,
    };
};

const getTasks = async (req: NextApiRequest) => {
    // get the user
    const user = await Authentication.getUser(req);

    // get the team that we want to create the task for
    const teamId = req.query.teamId as string;
    const membership = await Membership.getByTeamId(user, teamId);

    return Task.getAll(membership.team);
};

const controller = async (req: NextApiRequest) => {
    if(req.method === "POST") {
        return await createTask(req);
    } if(req.method === "GET") {
        return await getTasks(req);
    } else {
        throw new UnsupportedMethodError();
    }
};

export default middleware(controller);