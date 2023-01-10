import { TeamInvitationType } from "@lib/client/invitation";
import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { useAppSelector } from "redux/hooks";

type InvitationSliceType = {
    teamInvitations: TeamInvitationType[];
    isLoading: boolean;
};

const initialState: TeamInvitationSliceType = {
    teamInvitations: [],
    isLoading: false,
};

export const useTeamInvitations = () => {
    return useAppSelector((state) => state.teamInvitations);
};

export const TeamInvitationSlice = createSlice({
    name: "teamInvitations",
    initialState,
    reducers: {
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        setTeamInvitations: (state, action: PayloadAction<InvitationType[]>) => {
            state.teamInvitations = action.payload;
        }
    }
});

export const TeamInvitationActions = TeamInvitationSlice.actions;