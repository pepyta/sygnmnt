import { Submission } from "@prisma/client";
import Runner from "./runner";
import prisma from "./prisma";

class RunnerManager {
    private static MAX_NUMBER_OF_CONCURENT_RUNS = 5;

    private numberOfActiveRunners = 0;
    private queued: Submission[] = [];
    
    constructor() {
        console.log("[RunnerManager] Initializing runner manager...");
    }

    public async enqueue(submission: Submission) {
        this.queued.push(submission);

        if(this.numberOfActiveRunners < RunnerManager.MAX_NUMBER_OF_CONCURENT_RUNS) {
            await this.next();
        }
    }

    public async initialize() {
        const submissions = await prisma.submission.findMany({
            where: {
                status: "WAITING",
            },
        });

        console.log("[RunnerManager] Found " + submissions.length + " waiting submissions in the database. Running them...");

        // enqueue all submissions at once and let the manager decide the order
        return await Promise.all(submissions.map(this.enqueue));
    }

    private async next() {
        if(this.queued.length === 0) {
            console.info("Not starting new run as queue is empty.");
            return;
        }
        
        // mark this run as running
        this.numberOfActiveRunners += 1;
        
        // gets the one that has been in the queue for the longest time
        const submission = this.queued.shift(); 

        try {
            const { files, task } = await prisma.submission.findUnique({
                where: {
                    id: submission.id,
                },
                include: {
                    files: true,
                    task: true,
                }
            });

            const runner = new Runner(files, task.language);
            
            // update status for submission
            await prisma.submission.update({
                where: {
                    id: submission.id,
                },
                data: {
                    status: "BUILDING",
                },
            });

            await runner.build({
                onError: async (error) => {
                    await prisma.log.create({
                        data: {
                            createdAt: new Date(),
                            submission: {
                                connect: {
                                    id: submission.id,
                                },
                            },
                            content: error,
                            type: "ERROR",
                            status: "BUILDING",
                        },
                    });
                },
                onLog: async (content) => {
                    await prisma.log.create({
                        data: {
                            createdAt: new Date(),
                            submission: {
                                connect: {
                                    id: submission.id,
                                },
                            },
                            content,
                            type: "STANDARD",
                            status: "BUILDING",
                        },
                    });
                },
            });

            await prisma.submission.update({
                where: {
                    id: submission.id,
                },
                data: {
                    status: "RUNNING",
                },
            });

            const exitCode = await runner.run({
                onError: async (content) => {
                    await prisma.log.create({
                        data: {
                            createdAt: new Date(),
                            submission: {
                                connect: {
                                    id: submission.id,
                                },
                            },
                            content,
                            type: "ERROR",
                            status: "RUNNING",
                        },
                    });
                },
                onLog: async (content) => {
                    await prisma.log.create({
                        data: {
                            createdAt: new Date(),
                            submission: {
                                connect: {
                                    id: submission.id,
                                },
                            },
                            content,
                            type: "STANDARD",
                            status: "RUNNING",
                        },
                    });
                },
            });

            await prisma.submission.update({
                where: {
                    id: submission.id,
                },
                data: {
                    status: exitCode !== 0 ? "FAILED"
                        : task.needsVerification ? "AWAITING_MANUAL_CHECK" : "PASSED",
                },
            });
        } catch(e) {
            await prisma.submission.update({
                where: {
                    id: submission.id,
                },
                data: {
                    status: "FAILED",
                },
            });
        } finally {
            // remove the current runner from the counter
            this.numberOfActiveRunners -= 1;
        }

        return await this.next();
    }
}

// we must ensure that only one instance of runner manager is initialized to prevent overusing the machine
if(!global.RunnerManager) {
    global.RunnerManager = new RunnerManager();
    (global.RunnerManager as RunnerManager).initialize();
}

export default global.RunnerManager as RunnerManager;