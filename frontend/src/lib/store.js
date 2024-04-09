/**
 * import {
  combineReducers,
  configureStore,
  applyMiddleware,
} from '@reduxjs/toolkit'
import user from './features/user/userSlice.js'
import { createWrapper } from 'next-redux-wrapper'
//we cant hydrate all slices simultaneously
const rootReducer = combineReducers({
  user,
})

const initStoreWithProps = () => {
  return configureStore({
    reducer: rootReducer,
    devTools: true,
  })
}

export const Wrapper = createWrapper(initStoreWithProps)

 */
