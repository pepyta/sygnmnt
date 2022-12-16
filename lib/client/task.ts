import * as Prisma from "@prisma/client";
import RootApiHandler from "./fetch";
import Authentication from "./auth";
import { RunnerFile } from "@lib/server/runner";
import Membership from "./membership";

export default class Task {
    public static async create(teamId: string, name: string, description: string, language: Prisma.ProgrammingLanguage, files: RunnerFile[]): Promise<{
        message: string;
        task: Prisma.Task;
    }> {
        const response = await RootApiHandler.fetch(`/api/team/${teamId}/task`, {
            method: "POST",
            body: JSON.stringify({
                name,
                description,
                language,
                files: files.map((file) => ({
                    name: file.name,
                    content: file.content,
                })),
            }),
            headers: {
                "Authorization": `Bearer ${Authentication.getAccessToken()}`,
            },
        });

        await Membership.getAll();

        return response;
    }

    public static async edit(taskId: string, name: string, description: string, language: Prisma.ProgrammingLanguage, files: RunnerFile[]): Promise<{
        message: string;
        task: Prisma.Task;
    }> {
        const memberships = await Membership.getAll();
        const membership = memberships.find((membership) => membership.team.tasks.some((task) => task.id === taskId));
        

        const response = await RootApiHandler.fetch(`/api/team/${membership.teamId}/task/${taskId}`, {
            method: "PATCH",
            body: JSON.stringify({
                name,
                description,
                language,
                files: files.map((file) => ({
                    name: file.name,
                    content: file.content,
                })),
            }),
            headers: {
                "Authorization": `Bearer ${Authentication.getAccessToken()}`,
            },
        });

        await Membership.getAll();

        return response;
    }

    public static async delete(taskId: string): Promise<{
        message: string;
        task: Prisma.Task;
    }> {
        const memberships = await Membership.getAll();
        const membership = memberships.find((membership) => membership.team.tasks.some((task) => task.id === taskId));
        
        const response = await RootApiHandler.fetch(`/api/team/${membership.teamId}/task/${taskId}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${Authentication.getAccessToken()}`,
            },
        });

        await Membership.getAll();

        return response;
    }

    public static async getAll(teamId: string): Promise<(Prisma.Task & { files: Prisma.File[] })[]> {
        return await RootApiHandler.fetch(`/api/team/${teamId}/task`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${Authentication.getAccessToken()}`,
            },
        });
    }
}
