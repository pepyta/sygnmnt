import { ProgrammingLanguage, Team as PrismaTeam } from "@prisma/client";
import prisma from "./prisma";

export default class TaskFile {
    /**
     * Creates a new task for a team.
     * @param team The team that we want to create the team for.
     * @param name The name of the task.
     * @param description The description of the task.
     * @param language The language of the task.
     * @returns A task that has been created.
     */
    public static async create(team: PrismaTeam, name: string, description: string, language: ProgrammingLanguage) {
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
            }
        });
    }

    /**
     * Gets all of the tasks for a given team.
     * @param team The team that we want to get the tasks for.
     * @returns An array of tasks.
     */
    public static async getAll(team: PrismaTeam) {
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
}
