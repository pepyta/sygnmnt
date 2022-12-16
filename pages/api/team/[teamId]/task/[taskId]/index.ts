import { Authentication } from "@lib/server/auth";
import { ForbiddenError, UnsupportedMethodError } from "@lib/server/errors";
import Membership from "@lib/server/membership";
import { middleware } from "@lib/server/middleware";
import Task from "@lib/server/task";
import { NextApiRequest } from "next";
import * as Prisma from "@prisma/client";

const deleteTask = async (req: NextApiRequest) => {
    // get the user
    const user = await Authentication.getUser(req);

    // get the team that we want to create the task for
    const teamId = req.query.teamId as string;
    const taskId = req.query.teamId as string;
    const membership = await Membership.getByTeamId(user, teamId);
    const task = await Task.getById(taskId);

    // only owners and auxiliaries can create new task
    if(membership.role !== "OWNER" && membership.role !== "AUXILIARY") {
        throw new ForbiddenError();
    }

    await Task.delete(task);

    return {
        message: "Task successfully deleted!",
        task,
    };
};

const editTask = async (req: NextApiRequest) => {
    // get the user
    const user = await Authentication.getUser(req);

    // get the team that we want to create the task for
    const teamId = req.query.teamId as string;
    const taskId = req.query.teamId as string;
    const membership = await Membership.getByTeamId(user, teamId);
    const task = await Task.getById(taskId);

    // only owners and auxiliaries can create new task
    if(membership.role !== "OWNER" && membership.role !== "AUXILIARY") {
        throw new ForbiddenError();
    }

    // verify parameters
    const { name, description, language, files } = JSON.parse(req.body);
    if(!name || name.length === 0) throw new Error("You must set a name for the task!");
    if(!description || description.length === 0) throw new Error("You must set a description for the task!");
    const programmingLanguage: Prisma.ProgrammingLanguage = language === "C" ? "C" : "CPP";

    const updatedTask = await Task.edit(task, { name, description, language, files, programmingLanguage });

    return {
        message: "Task successfully updated!",
        task: updatedTask,
    };
};

const controller = async (req: NextApiRequest) => {
    if(req.method === "DELETE") {
        return await deleteTask(req);
    } if(req.method === "PATCH") {
        return await editTask(req);
    } else {
        throw new UnsupportedMethodError();
    }
};

export default middleware(controller);