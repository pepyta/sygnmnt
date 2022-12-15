import * as Prisma from "@prisma/client";
import { RunnerFile } from "./runner";
import Task from "./task";

export default class Submission {
    public static async create(user: Prisma.User, task: Prisma.Task, files: RunnerFile[]) {
        const { files: teacherFiles } = await Task.getById(task.id); 
        return await prisma.submission.create({
            data: {
                task: {
                    connect: {
                        id: task.id,
                    },
                },
                user: {
                    connect: {
                        id: user.id,
                    },
                },
                files: {
                    createMany: {
                        data: [...files, ...teacherFiles].map((file) => ({
                            name: file.name,
                            content: file.content,
                        })),
                    },
                },
            },
        });
    }
}