import { randomUUID } from "crypto";
import fs from "fs/promises";
import fsSync from "fs";
import { spawn } from "child_process";
import DockerFile from "./docker";
import { ProgrammingLanguage } from "@prisma/client";

type LogHooks = {
    onError?: (error: string) => void;
    onLog?: (message: string) => void;
};

export type RunnerFile = {
    name: string;
    content: string;
};

export class BuildError extends Error {
    constructor(exitCode: number) {
        super("An error happenned during build process! Error code: " + exitCode);
    }
}

export class RuntimeError extends Error {
    constructor(exitCode: number) {
        super("Error while running the submission. Exit code: " + exitCode);
    }
}

export class UnauthorizedError extends Error {
    constructor(message: string) {
        super(message);
    }
}

export default class Runner {
    private static MAX_MEMORY = "128M";
    private static MAX_CPU_CORE = 1;

    private static BUILD_TIMEOUT = 10000;
    private static RUN_TIMEOUT = 1000;
    
    private id: string;

    private getDockerTag() {
        return `sygnmnt-runner-${this.id}`;
    }

    constructor(private files: RunnerFile[], private programmingLanguage: ProgrammingLanguage) {
        this.id = randomUUID();
    }

    /**
     * Runs the image in a container.
     */
    public async run(options?: LogHooks) {
        // get the tag for the docker image
        const tag = this.getDockerTag();

        // create a process to run the docker image
        const process = spawn("docker", [
            "run",
            "--memory-swap", "0",
            "--memory", Runner.MAX_MEMORY,
            `--cpus=${Runner.MAX_CPU_CORE}`,
            tag,
        ], {
            detached: true,
        });

        const timeout = setTimeout(() => {
            process.kill("SIGABRT");
        }, Runner.RUN_TIMEOUT);

        // attach on log hook
        if(options && options.onLog) {
            process.stdout.on("data", (data) => options.onLog(data));
        }

        // attach on error hook
        if(options && options.onError) {
            process.stderr.on("data", (data) => options.onError(Buffer.from(data).toString("utf8")));
        }

        return new Promise((resolve, reject) => {
            // wait for process to exit and check code
            process.on("exit", (code) => {
                clearTimeout(timeout);
                if(code !== 0) {
                    const error = new RuntimeError(code);

                    // call on error hook to write custom error
                    if(options && options.onError) {
                        options.onError(error.message);
                    }
                    
                    reject(error);
                }

                resolve(code);
            })
        });
    }

    public async cleanup() {
        const tag = this.getDockerTag();
        const process = spawn("docker", ["image", "rm", tag], {
            detached: true,
        });

        process.stderr.on("data", (data) => console.error(Buffer.from(data).toString("utf-8")));

        await new Promise((resolve, reject) => {
            process.on("exit", (code) => {
                if(code !== 0) reject(new Error("An error happenned during deleting image!"));
                resolve(true);
            })
        });

        await fs.rmdir(`./runs/${this.id}`);
    }

    /**
     * Builds the files for the given runner into a Docker image.
     */
    public async build(options?: LogHooks) {
        // handle if someone tries to overwrite the dockerfile
        if (this.files.some((file) => file.name.includes("Dockerfile"))) {
            const error = new UnauthorizedError("Can't overwrite the Dockerfile!");
            if(options && !!options.onError) {
                options.onError(error.message);
            }

            throw error;
        }

        // create the folder for the runner if it is not existing
        if(!fsSync.existsSync("./runs")) await fs.mkdir("./runs");

        // create folder for the runner
        await fs.mkdir(`./runs/${this.id}`);

        // copy file contents to the folder
        await Promise.all(
            this.files.map(
                (file) => fs.writeFile(`./runs/${this.id}/${file.name}`, file.content)
            )
        );

        // generate dockerfile for the chosen programming language
        const dockerfile = this.programmingLanguage === "C"
            ? DockerFile.generateC(this.files)
            : DockerFile.generateCpp(this.files)
    
        await fs.writeFile(`./runs/${this.id}/Dockerfile`, dockerfile);

        // build the docker image
        const tag = this.getDockerTag();
        const process = spawn("docker", [
            "image",
            "build",

            // limit resource usage 
            "--memory-swap", "0",
            "--memory", Runner.MAX_MEMORY,
            
            // add tag for the image
            "-t", tag,
            
            ".",
        ], {
            cwd: `./runs/${this.id}`,
            detached: true,
        });

        const timeout = setTimeout(() => {
            process.kill("SIGABRT");
        }, Runner.BUILD_TIMEOUT);

        // attach on log hook
        if(options && !!options.onLog) {
            process.stdout.on("data", options.onLog);
        }

        // attach on error hook
        if(options && !!options.onError) {
            process.stderr.on("data", (chunk) => options.onError(Buffer.from(chunk).toString("utf8")));
        }

        await new Promise((resolve, reject) => {
            process.on("exit", (code) => {
                clearTimeout(timeout);
                if(code !== 0) {
                    const error = new BuildError(code);
                    if(options && !!options.onError) {
                        options.onError(error.message);    
                    } 

                    reject(error);
                }

                resolve(true);
            })
        });
    }
}

