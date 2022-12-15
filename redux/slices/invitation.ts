import { InvitationType } from "@lib/client/invitation";
import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { useAppSelector } from "redux/hooks";

type InvitationSliceType = {
    invitations: InvitationType[];
    isLoading: boolean;
};

const initialState: InvitationSliceType = {
    invitations: [],
    isLoading: false,
};

export const useInvitations = () => {
    return useAppSelector((state) => state.invitations);
};

export const InvitationSlice = createSlice({
    name: "invitations",
    initialState,
    reducers: {
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        setInvitations: (state, action: PayloadAction<InvitationType[]>) => {
            state.invitations = action.payload;
        }
    }
});

export const InvitationActions = InvitationSlice.actions;