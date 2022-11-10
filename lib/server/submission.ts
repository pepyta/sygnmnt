import { RunnerFile } from "./runner";

export default class Submission {
    public static async getAll(taskId: string) {
        return await prisma.submission.findMany({
            where: {
                taskId,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    }

    public static async create(userId: string, taskId: string, files: RunnerFile) {
        return await prisma.submission.create({
            data: {
                task: {
                    connect: {
                        id: taskId,
                    },
                },
                user: {
                    connect: {
                        id: userId,
                    },
                },
                files: {
                    createMany: {
                        data: files,
                    },
                },
            },
        });
    }
}