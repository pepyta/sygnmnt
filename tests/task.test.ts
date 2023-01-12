import { describe, expect, test, beforeAll } from '@jest/globals';
import { Authentication } from '@lib/server/auth';
import Team from '@lib/server/team';
import { randomUUID } from 'crypto';
import * as Prisma from "@prisma/client";
import Task from '@lib/server/task';
import Submission from '@lib/server/submission';
import { PastDeadlineError } from "@lib/server/errors";

describe("task creation and management", () => {
    let user: Prisma.User;
    let team: Prisma.Team;
    let member: Prisma.User;
    let taskWithDeadlineOver: Prisma.Task;
    let taskWithTimeLeft: Prisma.Task;

    const name = "Test task";
    const nameNoDeadline = "Test no deadline task";
    const creation = new Date(0);
    const description = "This is the description for the `Test Task`...";
    const language: Prisma.ProgrammingLanguage = "C";

    beforeAll(async () => {
        const teamName = "Test submission team";
        const username = `test-runner-${randomUUID()}`;
        const password = randomUUID();
        await Authentication.register(username, password);
        const access_token = await Authentication.login(username, password);
        user = Authentication.verifyToken(access_token);
        
        const memberUsername = `test-runner-${randomUUID()}`;
        const memberPassword = randomUUID();
        await Authentication.register(memberUsername, memberPassword);
        const member_access_token = await Authentication.login(memberUsername, memberPassword);
        member = Authentication.verifyToken(member_access_token);
        team = await Team.create(teamName, user);
        await Team.addMember(member, team, Prisma.Role.MEMBER);
    });

    test('should not have any tasks', async () => {
        const tasks = await Task.getAll(team);
        expect(tasks.length).toBe(0);
    });

    test('should create a new task', async () => {
        taskWithDeadlineOver = await Task.create(team, name, creation, true, description, language, []);
        taskWithTimeLeft = await Task.create(team, nameNoDeadline, new Date(new Date().valueOf() * 2), true, description, language, []);
    });

    test('should have the task created', async () => {
        const tasks = await Task.getAll(team);
        expect(tasks.length).toBe(2);
        expect(taskWithDeadlineOver.name).toBe(name);
        expect(taskWithDeadlineOver.dueDate).toStrictEqual(creation);
        expect(taskWithDeadlineOver.hardDeadline).toBe(true);
        expect(taskWithDeadlineOver.description).toBe(description);
        expect(taskWithDeadlineOver.language).toBe(language);
    });

    test('should not be able to submit after hard deadline', async () => {
        expect(() => Submission.create(member, taskWithDeadlineOver, []))
            .rejects
            .toThrow(new PastDeadlineError());
        expect(Submission.create(member, taskWithTimeLeft, [])).toBeTruthy();
    });

    test('should delete task', async () => {
        const tasks = await Task.getAll(team);
        expect(tasks.length).toBe(2);
        expect(await Task.delete(taskWithDeadlineOver)).toBeTruthy();
        expect(await Task.delete(taskWithTimeLeft)).toBeTruthy();
    });

    test('should not have any tasks', async () => {
        const tasks = await Task.getAll(team);
        expect(tasks.length).toBe(0);
    });
});

