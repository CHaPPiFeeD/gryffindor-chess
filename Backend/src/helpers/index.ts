import { API_ERROR_CODES } from '../enum/errorsCode'


export class Response {
  constructor(res: ResponseDto) {
    const result: ResponseDto = {
      status: true,
      status_code: 204,
      timestamp: new Date().toISOString(),
      errors: null,
      path: null,
      data: null,
    }
    return { ...result, ...res }
  }
}

export const N = (number: string | number | boolean): number => {
  number = +number || 0
  return Math.round(number * 100000000) / 100000000
}

export class ResponseDto {
  status?: boolean
  status_code: number
  timestamp?: string
  errors?: ErrorType[] | null
  path: string
  data?: any | null
}

interface ErrorType {
  code: API_ERROR_CODES,
  message: string,
}