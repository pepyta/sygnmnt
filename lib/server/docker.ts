import { RunnerFile } from "./runner";

export default class DockerFile {
    public static generateC(files: RunnerFile[]) {
        return `
            FROM gcc:4.9
            ${files.map((file) => `COPY ${file.name} ${file.name}`).join("\n")}
            RUN gcc -std=c99 -o final ${files.map((file) => file.name).join(" ")}
            CMD ["./final"]
        `;
    }

    public static generateCpp(files: RunnerFile[]) {
        return `
            FROM alpine:3.14
            RUN apk add build-base
            ${files.map((file) => `COPY ${file.name} ${file.name}`).join("\n")}
            RUN g++ -o final ${files.map((file) => file.name).join(" ")}
            CMD ["./final"]
        `;
    }
}