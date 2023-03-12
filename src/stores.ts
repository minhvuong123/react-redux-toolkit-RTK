import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/dist/query'
import { rtkQueryErrorLogger } from 'middleware'
import { blogApi } from 'pages/blog/blog.service'
import blogReducer from 'pages/blog/blog.slice'
import { useDispatch } from 'react-redux'

export const store = configureStore({
  reducer: {
    blog: blogReducer,
    [blogApi.reducerPath]: blogApi.reducer // reducer tao tu api slice
  },
  // them middlewares de enable cac tinh nang nhu caching, invalidation, polling cua rtk
  middleware: (getDetaultMiddleware) => {
    return getDetaultMiddleware().concat(blogApi.middleware, rtkQueryErrorLogger)
  }
})

// Optional, nhung bat buoc neu dung tinh nang refetchOnFocus/refetchOnReconnect
setupListeners(store.dispatch)

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch

// use when dispatch a thunk Api
export const useAppDispatch = () => useDispatch<AppDispatch>()
