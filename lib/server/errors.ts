export class UnauthorizedError extends Error {
    constructor() {
        super("Unauthorized");
    }
}

export class PastDeadlineError extends Error {
    constructor() {
        super("You are not allowed to submit solutions after the deadline!");
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

export class AlreadyMemberError extends Error {
    constructor() {
        super("The person that you want to invite is already a member of the group.");
    }
}

export class InvitationNotFoundError extends Error {
    constructor() {
        super("Could not find the invitation that you want to accept or reject.");
    }
}

export class TeamNotFoundError extends Error {
    constructor() {
        super("Team not found.");
    }
}