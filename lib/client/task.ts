import { ProgrammingLanguage } from "@prisma/client";
import RootApiHandler from "./fetch";
import { Task as PrismaTask } from "@prisma/client";
import Authentication from "./auth";

export default class Task {
    public static async create(teamId: string, name: string, description: string, language: ProgrammingLanguage): Promise<{
        message: string;
        task: PrismaTask;
    }> {
        return await RootApiHandler.fetch(`/api/team/${teamId}/task`, {
            method: "POST",
            body: JSON.stringify({
                name,
                description,
                language,
            }),
            headers: {
                "Authorization": `Bearer ${Authentication.getAccessToken()}`,
            },
        });
    }

    public static async getAll(teamId: string): Promise<PrismaTask[]> {
        return await RootApiHandler.fetch(`/api/team/${teamId}/task`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${Authentication.getAccessToken()}`,
            },
        });
    }
}
