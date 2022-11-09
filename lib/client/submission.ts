import Authentication from "@lib/client/auth";
import RootApiHandler from "@lib/client/fetch";
import { RunnerFile } from "@lib/server/runner";
import { Submission as PrismaSubmission } from "@prisma/client";

export default class Submission {
    public static async getAll(teamId: string, taskId: string): Promise<PrismaSubmission[]> {
        return await RootApiHandler.fetch(`/api/team/${teamId}/task/${taskId}/submission`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${Authentication.getAccessToken()}`,
            },
        });
    }

    public static async create(teamId: string, taskId: string, files: RunnerFile[]): Promise<{ message: string; submission: PrismaSubmission }> {
        return await RootApiHandler.fetch(`/api/team/${teamId}/task/${taskId}/submission`, {
            method: "POST",
            body: JSON.stringify({
                files,
            }),
            headers: {
                "Authorization": `Bearer ${Authentication.getAccessToken()}`,
            },
        });
    }
}