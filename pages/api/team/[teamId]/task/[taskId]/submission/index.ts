import { Authentication } from "@lib/server/auth";
import { ForbiddenError, UnsupportedMethodError } from "@lib/server/errors";
import manager from "@lib/server/manager";
import Membership from "@lib/server/membership";
import { middleware } from "@lib/server/middleware";
import Submission from "@lib/server/submission";
import Task from "@lib/server/task";
import { Submission as PrismaSubmission } from "@prisma/client";
import { NextApiRequest } from "next";

const createSubmission = async (req: NextApiRequest) => {
    // get the user
    const user = await Authentication.getUser(req);

    // get the team that we want to create the task for
    const teamId = req.query.teamId as string;
    const taskId = req.query.taskId as string;
    const membership = await Membership.getByTeamId(user, teamId);

    // only allow submissions from students
    if(membership.role !== "MEMBER") {
        throw new ForbiddenError();
    }

    // verify parameters
    const { files } = JSON.parse(req.body);
    if(!files || files.length === 0) throw new Error("You must send files to submission!");
    const task = await Task.getById(taskId);

    const submission = await Submission.create(user, task, files);
    manager.enqueue(submission);

    return {
        message: "Submission successfully created!",
        submission,
    };
};

const controller = async (req: NextApiRequest) => {
    if(req.method === "POST") {
        return await createSubmission(req);
    } else {
        throw new UnsupportedMethodError();
    }
};

export default middleware(controller);