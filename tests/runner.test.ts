import { describe, expect, test } from '@jest/globals';
import Runner, { BuildError, RuntimeError, UnauthorizedError } from "@lib/server/runner";
import fs from "fs/promises";
import path from 'path';

describe("Test for C files", () => {
    test('test with a successful submission', async () => {
        const runner = new Runner([
            {
                name: "teacher.c",
                content: (await fs.readFile(path.join(__dirname, "/data/c/success.teacher.c"))).toString("utf-8"),
            },
            {
                name: "student.c",
                content: (await fs.readFile(path.join(__dirname, "/data/c/success.student.c"))).toString("utf8"),
            }
        ], "C");

        await runner.build();

        const exitCode = await runner.run();

        expect(exitCode).toBe(0);
    });

    test('test submission with syntax error', async () => {
        const runner = new Runner([
            {
                name: "input.c",
                content: (await fs.readFile(path.join(__dirname, "/data/c/fail.syntax-error.c"))).toString("utf-8"),
            },
        ], "C");

        await expect(runner.build())
            .rejects
            .toThrow(new BuildError(1));
    });

    test('test submission that fails', async () => {
        const runner = new Runner([
            {
                name: "teacher.c",
                content: (await fs.readFile(path.join(__dirname, "/data/c/fail.teacher.c"))).toString("utf-8"),
            },
            {
                name: "student.c",
                content: (await fs.readFile(path.join(__dirname, "/data/c/fail.student.c"))).toString("utf8"),
            }
        ], "C");

        await runner.build();

        await expect(runner.run())
            .rejects
            .toThrow(new RuntimeError(1));
    });

    test('test submission without file', async () => {
        const runner = new Runner([], "C");

        await expect(runner.build())
            .rejects
            .toThrow(new BuildError(1));
    });

    test('test submission with custom dockerfile', async () => {
        const runner = new Runner([
            {
                name: "Dockerfile",
                content: `FROM alpine:18`,
            }
        ], "C");

        await expect(runner.build())
            .rejects
            .toThrow(Error);
    });
});

describe("Test for C++ files", () => {
    test('test with a successful submission', async () => {
        const runner = new Runner([
            {
                name: "success.cpp",
                content: (await fs.readFile(path.join(__dirname, "/data/cpp/success.cpp"))).toString("utf8"),
            }
        ], "CPP");

        await runner.build();

        const exitCode = await runner.run();

        expect(exitCode).toBe(0);
    });

    test('test with a failing submission with syntax errors', async () => {
        const runner = new Runner([
            {
                name: "syntax-error.cpp",
                content: (await fs.readFile(path.join(__dirname, "/data/cpp/syntax-error.cpp"))).toString("utf8"),
            }
        ], "CPP");

        expect(runner.build())
            .rejects
            .toThrow(new BuildError(1));
    });

    test('test with a failing submission at runtime', async () => {
        const runner = new Runner([
            {
                name: "fail.cpp",
                content: (await fs.readFile(path.join(__dirname, "/data/cpp/fail.cpp"))).toString("utf8"),
            }
        ], "CPP");
        
        await runner.build();

        expect(runner.run())
            .rejects
            .toThrow(new RuntimeError(1));
    });
})