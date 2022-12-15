import { File, Membership, Submission, Task, Team, User } from "@prisma/client";
import { useAppSelector } from "@redux/hooks";
import { createSlice, PayloadAction } from "@reduxjs/toolkit"

export type ExtendedSubmissionType = Submission & {
    files: File[];
    user: Omit<User, "password">;
};

export type ExtendedTaskType = Task & {
    files: File[];
    submissions: ExtendedSubmissionType[];
};

export type ExtendedTeamType = Team & {
    memberships: (Membership & {
        user: Omit<User, "password">;
    })[];
    tasks: ExtendedTaskType[];
};

export type ExtendedMembershipType = Membership & {
    team: ExtendedTeamType;
};

type MembershipSliceType = {
    memberships: ExtendedMembershipType[];
    isLoading: boolean;
};

const initialState: MembershipSliceType = {
    memberships: [],
    isLoading: false,
};

export const useMemberships = () => {
    return useAppSelector((state) => state.membership);
};

export const MembershipSlice = createSlice({
    name: "memberships",
    initialState,
    reducers: {
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        setMemberships: (state, action: PayloadAction<ExtendedMembershipType[]>) => {
            state.memberships = action.payload;
        }
    }
});

export const MembershipActions = MembershipSlice.actions;