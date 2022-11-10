export class UnauthorizedError extends Error {
    constructor() {
        super("Unauthorized");
    }
}

export class ForbiddenError extends Error {
    constructor() {
        super("You don't have permission for this!");
    }
}

export class UsernameAlreadyTakenError extends Error {
    constructor() {
        super()
    }
}

export class UnsupportedMethodError extends Error {
    constructor() {
        super("Unsupported method");
    }
}

export class PasswordMismatchError extends Error {
    constructor() {
        super("Password mismatch");
    }
}

export class UserNotFoundError extends Error {
    constructor() {
        super("User not found with given username!");
    }
}

export class MethodNotImplementedError extends Error {
    constructor() {
        super("This method is not implemented yet! Check back later.");
    }
}