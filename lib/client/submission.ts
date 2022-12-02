import Authentication from "@lib/client/auth";
import RootApiHandler from "@lib/client/fetch";
import { RunnerFile } from "@lib/server/runner";
import { Submission as PrismaSubmission } from "@prisma/client";
import Membership from "./membership";

export default class Submission {
    public static async getAll(taskId: string): Promise<PrismaSubmission[]> {
        const memberships = await Membership.getAll();
        const membership = await memberships.find((el) => el.team.tasks.some((el) => el.id === taskId));
        
        return await RootApiHandler.fetch(`/api/team/${membership.team.id}/task/${taskId}/submission`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${Authentication.getAccessToken()}`,
            },
        });
    }

    public static async create(taskId: string, files: RunnerFile[]): Promise<{ message: string; submission: PrismaSubmission }> {
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
}