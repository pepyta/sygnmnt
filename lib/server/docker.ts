import { File } from "./file";

export default class DockerFile {
    public static generateC(files: File[]) {
        return `
            FROM alpine:3.14
            RUN apk add build-base
            ${files.map((file) => `COPY ${file.name} ${file.name}`).join("\n")}
            RUN gcc -o final ${files.map((file) => file.name).join(" ")}
            CMD ["./final"]
        `;
    }

    public static generateCpp(files: File[]) {
        return `
            FROM alpine:3.14
            RUN apk add build-base
            ${files.map((file) => `COPY ${file.name} ${file.name}`).join("\n")}
            RUN g++ -o final ${files.map((file) => file.name).join(" ")}
            CMD ["./final"]
        `;
    }
}