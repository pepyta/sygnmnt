import Authentication from "@lib/client/auth";
import RootApiHandler from "@lib/client/fetch";
import { RunnerFile } from "@lib/server/runner";
import * as Prisma from "@prisma/client";
import Membership from "./membership";

export default class Submission {
    public static async getAll(taskId: string): Promise<Prisma.Submission[]> {
        const memberships = await Membership.getAll();
        const membership = await memberships.find((el) => el.team.tasks.some((el) => el.id === taskId));
        
        return await RootApiHandler.fetch(`/api/team/${membership.team.id}/task/${taskId}/submission`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${Authentication.getAccessToken()}`,
            },
        });
    }

    public static async create(taskId: string, files: RunnerFile[]): Promise<{ message: string; submission: Prisma.Submission }> {
        const memberships = await Membership.getAll();
        const membership = await memberships.find((el) => el.team.tasks.some((el) => el.id === taskId));
        
        const response = await RootApiHandler.fetch(`/api/team/${membership.team.id}/task/${taskId}/submission`, {
            method: "POST",
            body: JSON.stringify({
                files,
            }),
            headers: {
                "Authorization": `Bearer ${Authentication.getAccessToken()}`,
            },
        });

        await Membership.getAll();

        return response;
    }

    public static async edit(submissionId: string, status: Prisma.SubmissionStatus): Promise<{ message: string; submission: Prisma.Submission }> {
        const memberships = await Membership.getAll();
        const membership = memberships.find((membership) => membership.team.tasks.some((task) => task.submissions.some((submission) => submission.id === submissionId)));
        const task = membership.team.tasks.find((task) => task.submissions.some((submission) => submission.id === submissionId));
        const submission = task.submissions.find((submission) => submission.id === submissionId);
        
        const response = await RootApiHandler.fetch(`/api/team/${membership.team.id}/task/${task.id}/submission/${submission.id}`, {
            method: "PATCH",
            body: JSON.stringify({
                status,
            }),
            headers: {
                "Authorization": `Bearer ${Authentication.getAccessToken()}`,
            },
        });

        await Membership.getAll();

        return response;
    }

    public static async delete(submissionId: string): Promise<{ message: string; success: boolean; submission: Prisma.Submission }> {
        const memberships = await Membership.getAll();
        const membership = memberships.find((membership) => membership.team.tasks.some((task) => task.submissions.some((submission) => submission.id === submissionId)));
        const task = membership.team.tasks.find((task) => task.submissions.some((submission) => submission.id === submissionId));
        const submission = task.submissions.find((submission) => submission.id === submissionId);

        const response = await RootApiHandler.fetch(`/api/team/${membership.team.id}/task/${task.id}/submission/${submission.id}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${Authentication.getAccessToken()}`,
            },
        });

        await Membership.getAll();

        return response;
    }
}