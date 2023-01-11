import { Authentication } from "@lib/server/auth";
import { ForbiddenError, UnsupportedMethodError } from "@lib/server/errors";
import manager from "@lib/server/manager";
import Membership from "@lib/server/membership";
import { middleware } from "@lib/server/middleware";
import Submission from "@lib/server/submission";
import Task from "@lib/server/task";
import { NextApiRequest } from "next";

const editSubmission = async (req: NextApiRequest) => {
    // get the user
    const user = await Authentication.getUser(req);

    // get the team that we want to create the task for
    const teamId = req.query.teamId as string;
    const submissionId = req.query.submissionId as string;
    const membership = await Membership.getByTeamId(user, teamId);

    // only allow submissions from students
    if(membership.role !== "OWNER" && membership.role !== "AUXILIARY") {
        throw new ForbiddenError();
    }

    const { status } = JSON.parse(req.body);

    // verify parameters
    const submission = await Submission.findById(submissionId);
    const updatedSubmission = await Submission.editStatus(submission, status);

    return {
        message: "Submission successfully edited!",
        submission: updatedSubmission,
    };
};


const deleteSubmission = async (req: NextApiRequest) => {
    // get the user
    const user = await Authentication.getUser(req);

    // get the team that we want to create the task for
    const teamId = req.query.teamId as string;
    const taskId = req.query.taskId as string;
    const submissionId = req.query.submissionId as string;
    const submission = await Submission.findById(submissionId);
    const membership = await Membership.getByTeamId(user, teamId);

    // only allow submissions from students
    if(membership.role !== "OWNER" && membership.role !== "AUXILIARY" && submission.userId !== user.id) {
        throw new ForbiddenError();
    }

    if(membership.role !== "OWNER" && membership.role !== "AUXILIARY"){
        const task = await Task.getById(taskId);
        const due = new Date(task.dueDate);
        const now = new Date();
        
        if(task.hardDeadline && due < now){
            return {
                success: false,
                message: "You are not allowed to delete submissions after deadline!",
            };
        }
    }

    // verify parameters
    await Submission.delete(submission);

    return {
        success: true,
        message: "Submission successfully deleted!",
        submission,
    };
};

const controller = async (req: NextApiRequest) => {
    if(req.method === "DELETE") {
        return await deleteSubmission(req);
    } if(req.method === "PATCH") {
        return await editSubmission(req);
    } else {
        throw new UnsupportedMethodError();
    }
};

export default middleware(controller);