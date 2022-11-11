import { describe, expect, test, beforeAll } from '@jest/globals';
import { Authentication } from '@lib/server/auth';
import Team from '@lib/server/team';
import { randomUUID } from 'crypto';
import * as Prisma from "@prisma/client";
import Task from '@lib/server/task';

describe("task creation and management", () => {
    let user: Prisma.User;
    let team: Prisma.Team;

    const name = "Test task";
    const description = "This is the description for the `Test Task`...";
    const language: Prisma.ProgrammingLanguage = "C";

    beforeAll(async () => {
        const teamName = "Test submission team";
        const username = `test-runner-${randomUUID()}`;
        const password = randomUUID();
        await Authentication.register(username, password);
        const access_token = await Authentication.login(username, password);
        user = Authentication.verifyToken(access_token);
        team = await Team.create(teamName, user);
    });

    test('should not have any tasks', async () => {
        const tasks = await Task.getAll(team);
        expect(tasks.length).toBe(0);
    });

    test('should create a new task', async () => {
        await Task.create(team, name, description, language);
    });

    test('should have the task created', async () => {
        const tasks = await Task.getAll(team);
        expect(tasks.length).toBe(1);
        expect(tasks[0].name).toBe(name);
        expect(tasks[0].description).toBe(description);
        expect(tasks[0].language).toBe(language);
    });
});

