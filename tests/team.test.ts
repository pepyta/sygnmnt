import { describe, expect, test, beforeAll } from '@jest/globals';
import { Authentication } from '@lib/server/auth';
import Membership from '@lib/server/membership';
import Team from '@lib/server/team';
import { User } from '@prisma/client';
import { randomUUID } from 'crypto';
import { Team as PrismaTeam, Role } from "@prisma/client";

describe("team access control", () => {
    const teamName = "Secret team";
    let user1: User, user2: User;
    beforeAll(async () => {
        const userAuth1 = { "username": `test-runner-${randomUUID()}`, "password": randomUUID() },
            userAuth2 = { "username": `test-runner-${randomUUID()}`, "password": randomUUID() };
        await Authentication.register(userAuth1["username"], userAuth1["password"]);
        await Authentication.register(userAuth2["username"], userAuth2["password"]);
        const access_token1 = await Authentication.login(userAuth1["username"], userAuth1["password"]),
            access_token2 = await Authentication.login(userAuth2["username"], userAuth2["password"]);
        user1 = Authentication.verifyToken(access_token1),
            user2 = Authentication.verifyToken(access_token2);
    });

    let createdTeam: PrismaTeam;

    test('user1 should be able to create team', async () => {
        createdTeam = await Team.create(teamName, user1);
    });

    test('user2 should not be able to access user1\'s team', async () => {
        await expect(Membership.getByTeamId(user2, createdTeam.id)).rejects.toThrowError();
        expect(await Membership.getByTeamId(user1, createdTeam.id)).toBeTruthy();
    });

    test('adding user2 to user1\'s team', async () => {
        await Team.addMember(user2, createdTeam, Role.AUXILIARY);
    });

    let user2Membership;
    test('user2 should now be able to access user1\'s team', async () => {
        expect(user2Membership = await Membership.getByTeamId(user2, createdTeam.id)).toBeTruthy();
    });

    test('user2 should still be unable to change the team\'s name', async () => {
        await expect(Team.update("Doesn't matter", user2Membership)).rejects.toThrowError();
    });
});

describe("team creation and management", () => {
    const teamName = "Test team";
    let user: User;
    let teamId: string;

    beforeAll(async () => {
        const username = `test-runner-${randomUUID()}`;
        const password = randomUUID();
        await Authentication.register(username, password);
        const access_token = await Authentication.login(username, password);
        user = Authentication.verifyToken(access_token);
    });

    test('should not have any teams', async () => {
        const teams = await Team.getAll(user);
        expect(teams.length).toBe(0);
    });

    test('should create a new team', async () => {
        expect(await Team.create(teamName, user)).toBeTruthy();
    });

    test('should have the team created', async () => {
        const teams = await Team.getAll(user);
        expect(teams.length).toBe(1);
        expect(teams[0].name).toBe(teamName);
        teamId = teams[0].id;
    });

    test('should have an empty team', async () => {
        const membership = await Membership.getByTeamId(user, teamId);
        expect(membership.teamId).toBe(teamId);
        expect(membership.team.memberships.length).toBe(1);
        expect(membership.role).toBe("OWNER");
        expect(membership.team.name).toBe(teamName);
    });

    test('should update the team name', async () => {
        const updatedName = "Epic new name 🥶";
        const membership = await Membership.getByTeamId(user, teamId);
        const team = await Team.update(updatedName, membership);
        expect(team.id).toBe(teamId);
        expect(team.name).toBe(updatedName);
    });
});

