import * as Prisma from "@prisma/client";
import RootApiHandler from "./fetch";
import Authentication from "./auth";
import { RunnerFile } from "@lib/server/runner";

export default class Task {
    public static async create(teamId: string, name: string, description: string, language: Prisma.ProgrammingLanguage, files: RunnerFile[]): Promise<{
        message: string;
        task: Prisma.Task;
    }> {
        return await RootApiHandler.fetch(`/api/team/${teamId}/task`, {
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
