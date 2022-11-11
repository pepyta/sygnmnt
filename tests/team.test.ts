import { describe, expect, test, beforeAll } from '@jest/globals';
import { Authentication } from '@lib/server/auth';
import Membership from '@lib/server/membership';
import Team from '@lib/server/team';
import { User } from '@prisma/client';
import { randomUUID } from 'crypto';

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

