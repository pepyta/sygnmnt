import { describe, expect, test, beforeAll } from '@jest/globals';
import { Authentication } from '@lib/server/auth';
import Membership from '@lib/server/membership';
import Team from '@lib/server/team';
import { randomUUID } from 'crypto';
import * as Prisma from "@prisma/client";
import Invitation from '@lib/server/invitation';
import { AlreadyMemberError, InvitationNotFoundError } from '@lib/server/errors';

describe("Test what happens when user rejects an invitation", () => {
    let owner: Prisma.User;
    let member: Prisma.User;
    let team: Prisma.Team;

    beforeAll(async () => {
        const userAuth1 = { "username": `test-runner-${randomUUID()}`, "password": randomUUID() };
        const userAuth2 = { "username": `test-runner-${randomUUID()}`, "password": randomUUID() };
        await Authentication.register(userAuth1["username"], userAuth1["password"]);
        await Authentication.register(userAuth2["username"], userAuth2["password"]);

        owner = await Authentication.verifyToken(
            await Authentication.login(userAuth1["username"], userAuth1["password"])
        );

        member = await Authentication.verifyToken(
            await Authentication.login(userAuth2["username"], userAuth2["password"])
        );

        team = await Team.create("Test team", owner);
    });


    test('should not have any invitations yet', async () => {
        const invitations = await Invitation.getAll(member);
        expect(invitations.length).toBe(0);
    });

    test('should be able to invite the user', async () => {
        expect(await Invitation.inviteUser(team, member)).toBeTruthy();
    });

    test('should have the invitation when querying', async () => {
        const invitations = await Invitation.getAll(member);
        expect(invitations.length).toBe(1);
        expect(invitations[0].teamId).toBe(team.id);
    });

    test('should reject the invitation', async () => {
        expect(await Invitation.rejectInvitation(member, team)).toBeTruthy();
    });

    test('should not be able to accept after rejection', async () => {
        expect(() => Invitation.acceptInvitation(member, team))
            .rejects
            .toThrow(new InvitationNotFoundError());
    });

    test('should not have any invitation again', async () => {
        const invitations = await Invitation.getAll(member);
        expect(invitations.length).toBe(0);
    });

    test('should not be in any group', async () => {
        const teams = await Team.getAll(member);
        expect(teams.length).toBe(0);
    });
});

describe("Test what happens when user accepts an invitation", () => {
    let owner: Prisma.User;
    let member: Prisma.User;
    let team: Prisma.Team;

    beforeAll(async () => {
        const userAuth1 = { "username": `test-runner-${randomUUID()}`, "password": randomUUID() };
        const userAuth2 = { "username": `test-runner-${randomUUID()}`, "password": randomUUID() };
        await Authentication.register(userAuth1["username"], userAuth1["password"]);
        await Authentication.register(userAuth2["username"], userAuth2["password"]);

        owner = await Authentication.verifyToken(
            await Authentication.login(userAuth1["username"], userAuth1["password"])
        );

        member = await Authentication.verifyToken(
            await Authentication.login(userAuth2["username"], userAuth2["password"])
        );

        team = await Team.create("Test team", owner);
    });


    test('should not have any invitations yet', async () => {
        const invitations = await Invitation.getAll(member);
        expect(invitations.length).toBe(0);
    });

    test('should be able to invite the user', async () => {
        expect(await Invitation.inviteUser(team, member)).toBeTruthy();
    });

    test('should have the invitation when querying', async () => {
        const invitations = await Invitation.getAll(member);
        expect(invitations.length).toBe(1);
        expect(invitations[0].teamId).toBe(team.id);
    });

    test('should accept the invitation', async () => {
        expect(await Invitation.acceptInvitation(member, team)).toBeTruthy();
    });

    test('should not have any invitation again', async () => {
        const invitations = await Invitation.getAll(member);
        expect(invitations.length).toBe(0);
    });

    test('should have the team in the list', async () => {
        const teams = await Team.getAll(member);
        expect(teams.length).toBe(1);
        expect(teams[0].id).toBe(team.id);
    });

    test('should have member role in the group', async () => {
        const membership = await Membership.getByTeamId(member, team.id);
        expect(membership.role).toBe("MEMBER");
    });

    test('should note be able to invite again', async () => {
        expect(() => Invitation.inviteUser(team, member))
            .rejects
            .toThrow(new AlreadyMemberError());
    });
});