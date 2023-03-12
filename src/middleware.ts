import { AnyAction, Middleware, MiddlewareAPI, isRejected, isRejectedWithValue } from '@reduxjs/toolkit'

import { toast } from 'react-toastify'
import { isEntityError } from 'utils/helpers'

function isPayloadErrorMessage(payload: unknown): payload is {
  data: {
    error: string
  }
  status: number
} {
  return (
    typeof payload === 'object' &&
    payload !== null &&
    'data' in payload &&
    typeof (payload as any).data?.error === 'string'
  )
}

export const rtkQueryErrorLogger: Middleware = (api: MiddlewareAPI) => {
  return (next) => {
    return (action: AnyAction) => {
      // if api bị rejected do strict mode thì isRejectedWithValue() = false

      if (isRejected()) {
        if (action.error?.name === 'CustomError') { /// CustomError được throw từ blo.service
          toast.warn(action.error.message)
        }
      }

      if (isRejectedWithValue(action)) {
        // mỗi khi thực hiện query hoặc mutation mà bị lỗi thì chạy vào đây
        // những lỗi từ server thì action có rejectedWithValue = true
        // Còn những action liên  quan đến việc caching mà bị rejected thì rejectedWithValue = false
        if (isPayloadErrorMessage(action.payload)) {
          // error từ server trả về
          toast.warn(action.payload.data.error)
        }
      }

      return next(action)
    }
  }
}
