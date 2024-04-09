/**
 * import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  user: 'abc',
  otp: 554802,
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setSession: (state, action) => {
      const { user, otp } = action.payload

      state.user = user
      state.otp = otp
    },
  },
})

export const { setSession } = userSlice.actions

export default userSlice.reducer

 */
