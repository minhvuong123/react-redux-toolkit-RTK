import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { Post } from 'types/blog.type'
import { CustomError } from 'utils/helpers'

// enpoint la 2 kieu query va mutation
// query: thuong dung cho method get
// mutation: tuong dung cho me thod post, put, delete

export const blogApi = createApi({
  reducerPath: 'blogApi',
  tagTypes: ['Posts'], // force recal getPosts api
  // keepUnusedDataFor: 10, // time of caching data => remove data caching after 10s
  baseQuery: fetchBaseQuery({ 
    baseUrl: 'http://localhost:4000/',
    prepareHeaders(headers) {
      return headers
    }
  }),
  endpoints: (build) => ({
    // res, args
    getPosts: build.query<Post[], void>({
      query: () => 'posts', // none arguments
      providesTags: (result) => {
        // force recal getPosts api

        // interface Tags: {
        //   type: "Posts", // definte ở tagTypes
        //   id: string
        // }[]

        if (result) {
          const final = [
            ...result.map(({ id }) => ({ type: 'Posts' as const, id })),
            { type: 'Posts' as const, id: 'LIST' }
          ]
          return final
        }

        const final = [{ type: 'Posts' as const, id: 'LIST' }]

        return final
      }
    }),
    addPost: build.mutation<Post, Omit<Post, 'id'>>({
      query: (body) => {
        try {
          // throw Error('ádadasd')
          // let a: any = null
          // a.b = 1
          return {
            url: 'posts',
            method: 'POST',
            body
          }
        } catch (error: any) {
          throw new CustomError(error.message)
        }
      },
      // invalidatesTags cung cấp các tag để báo cho những method nòa có providesTags
      // match với nó sẽ bị gọi lại
      // Trong tường hợp này getPosts sẽ chạy lại
      invalidatesTags: (result, error, data) => {
        // force recal getPosts api
        return error ? [] : [{ type: 'Posts' as const, id: 'LIST' }]
      }
    }),
    getPost: build.query<Post, string>({
      query: (id) => `posts/${id}`
    }),
    updatePost: build.mutation<Post, { id: string; body: Post }>({
      query: ({ id, body }) => {
        return {
          url: `posts/${id}`,
          method: 'PUT',
          body
        }
      },
      invalidatesTags: (result, error, data) => {
        // force recal getPosts api
        return error ? [] : [{ type: 'Posts' as const, id: data.id }]
      }
    }),
    deletePost: build.mutation<{}, string>({
      query: (id) => {
        return {
          url: `posts/${id}`,
          method: 'DELETE'
        }
      },
      invalidatesTags: (result, error, id) => {
        // force recal getPosts api
        return error ? [] : [{ type: 'Posts' as const, id }]
      }
    })
  })
})

// flow recall api :
// 1. addPost
// 2. invalidatesTags => { type: 'Posts' as const, id: 'LIST' }
// 3. providesTags of getPosts => cũng có { type: 'Posts' as const, id: 'LIST' }
// 4. getPosts recalled

export const { useGetPostsQuery, useAddPostMutation, useGetPostQuery, useUpdatePostMutation, useDeletePostMutation } = blogApi
