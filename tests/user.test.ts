import { describe, expect, test } from '@jest/globals';
import { Authentication } from '@lib/server/auth';
import { PasswordMismatchError, UsernameAlreadyTakenError, UserNotFoundError } from '@lib/server/errors';
import { randomUUID } from 'crypto';

describe("user creation and authentication", () => {

    // generate some random user data
    const username = `test-runner-${randomUUID()}`;
    const password = randomUUID();

    test('should not have any user with this name', () => {
        expect(() => Authentication.login(username, password))
            .rejects
            .toThrow(new UserNotFoundError());
    });

    test('should register with these data', async () => {
        expect(await Authentication.register(username, password)).toBe(true);
    });

    test('should not be able to register again', () => {
        expect(() => Authentication.register(username, password))
            .rejects
            .toThrow(new UsernameAlreadyTakenError());
    });
    
    test('should be able to login', async () => {
        const access_token = await Authentication.login(username, password);
        expect(typeof access_token).toBe("string");
        const user = Authentication.verifyToken(access_token);
        expect(typeof user).toBe("object");
        expect(typeof user.id).toBe("string");
        expect(user.username).toBe(username);
    });

    test('should not be able to log in with bad password', async () => {
        expect(() => Authentication.login(username, 'bad-password'))
            .rejects
            .toThrow(new PasswordMismatchError());
    });
});

