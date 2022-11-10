import { Authentication } from "@lib/server/auth";
import { UnsupportedMethodError } from "@lib/server/errors";
import manager from "@lib/server/manager";
import Membership from "@lib/server/membership";
import { middleware } from "@lib/server/middleware";
import Submission from "@lib/server/submission";
import { Submission as PrismaSubmission } from "@prisma/client";
import { NextApiRequest } from "next";

const createSubmission = async (req: NextApiRequest) => {
    // get the user
    const user = await Authentication.getUser(req);

    // get the team that we want to create the task for
    const teamId = req.query.teamId as string;
    const taskId = req.query.taskId as string;
    const membership = await Membership.getByTeamId(user, teamId);

    // todo: check if the user is a student

    // verify parameters
    const { files } = JSON.parse(req.body);
    if(!files || files.length === 0) throw new Error("You must send files to submission!");

    const submission = await Submission.create(user.id, taskId, files);
    manager.enqueue(submission);

    return {
        message: "Submission successfully created!",
        submission,
    };
};

const getSubmissions = async (req: NextApiRequest) => {
    // get the user
    const user = await Authentication.getUser(req);

    // get the team that we want to create the task for
    const teamId = req.query.teamId as string;
    const taskId = req.query.taskId as string;
    const membership = await Membership.getByTeamId(user, teamId);
    
    const submissions = await Submission.getAll(taskId);

    const isShown = (submission: PrismaSubmission) => {
        // show every submissson for owners and auxiliaries
        if(membership.role === "OWNER" || membership.role === "AUXILIARY") return true;
    
        // show only user's submissions for students
        return submission.userId === user.id;
    };

    return submissions.filter(isShown);
};

const controller = async (req: NextApiRequest) => {
    if(req.method === "POST") {
        return await createSubmission(req);
    } if(req.method === "GET") {
        return await getSubmissions(req);
    } else {
        throw new UnsupportedMethodError();
    }
};

export default middleware(controller);