import { configureStore } from '@reduxjs/toolkit'
import { InvitationSlice } from './slices/invitation'
import { MembershipSlice } from './slices/membership'

const store = configureStore({
  reducer: {
    invitations: InvitationSlice.reducer,
    membership: MembershipSlice.reducer,
  }
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch

export default store;