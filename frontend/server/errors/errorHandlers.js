import { HttpError } from './HttpError.js'

export function notFoundHandler(request, response) {
  response.status(404).json({ message: 'Không tìm thấy đường dẫn.' })
}

export function errorHandler(error, request, response, _next) {

  if (error instanceof HttpError) {
    return response.status(error.status).json({ message: error.message })
  }
  if (error.type === 'entity.parse.failed') {
    return response.status(400).json({ message: 'Dữ liệu gửi lên không hợp lệ.' })
  }
  console.error(error)
  return response.status(500).json({ message: 'Lỗi máy chủ. Vui lòng thử lại.' })
}
