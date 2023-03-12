// Phương pháp "type predicate" => dùng để thu hẹp kiểu thuộc tính

import { FetchBaseQueryError } from '@reduxjs/toolkit/dist/query'

// ép kiểu error của RTK-query từ FetchBaseQueryError | SerializedError => FetchBaseQueryError
export function isFetchBaseQueryError(error: unknown): error is FetchBaseQueryError {
  return typeof error === 'object' && error !== null && 'status' in error
}

// ép kiểu một error không xác định về object với mesage: string (SerializedError)
export function isErrorWithMessage(error: unknown): error is { message: string } {
  return typeof error === 'object' && error !== null && 'message' in error && typeof error.message === 'string'
}

// các kiểu res còn lại của FetchBaseQueryError
interface ErrorFormObject {
  [key: string | number]: string | ErrorFormObject | ErrorFormObject[]
}

interface EntityError {
  status: 422
  data: {
    error: ErrorFormObject
  }
}
export function isEntityError(error: unknown): error is EntityError {
  return (
    isFetchBaseQueryError(error) &&
    error.status === 422 &&
    typeof error.data === 'object' &&
    error.data !== null &&
    !(error.data instanceof Array)
  )
}

export class CustomError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'CustomError'
  }
}
