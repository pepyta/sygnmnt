import * as Prisma from "@prisma/client";
import prisma from "./prisma";
import { RunnerFile } from "./runner";

export default class Task {
    /**
     * Creates a new task for a team.
     * @param team The team that we want to create the team for.
     * @param name The name of the task.
     * @param description The description of the task.
     * @param language The language of the task.
     * @returns A task that has been created.
     */
    public static async create(team: Prisma.Team, name: string, description: string, language: Prisma.ProgrammingLanguage, files: RunnerFile[]) {
        return await prisma.task.create({
            data: {
                team: {
                    connect: {
                        id: team.id,
                    },
                },
                language,
                name,
                description,
                files: {
                    createMany: {
                        data: files,
                    },
                },
            },
        });
    }

    /**
     * Gets all of the tasks for a given team.
     * @param team The team that we want to get the tasks for.
     * @returns An array of tasks.
     */
    public static async getAll(team: Prisma.Team) {
        return await prisma.task.findMany({
            where: {
                teamId: team.id,
            },
            include: {
                files: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    }

    public static async delete(task: Prisma.Task) {
        return await prisma.task.delete({
            where: {
                id: task.id,
            },
        });
    }

    public static async edit(task: Prisma.Task, { files, ...data }) {
        await prisma.file.deleteMany({
            where: {
                taskId: task.id,
            },
        });

        return await prisma.task.update({
            where: {
                id: task.id,
            },
            data: {
                ...data,
                files: {
                    createMany: {
                        data: files,
                    },
                },
            },
        });
    }

    public static async getById(id: string) {
        return await prisma.task.findUnique({
            where: {
                id,
            },
            include: {
                files: true,
            },
        });
    }
}
