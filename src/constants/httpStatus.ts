enum HttpStatus {
  Ok = 200,
  Created = 201,
  BadRequest = 400,
  Unauthorized = 401,
  Forbidden = 403,
  NotFound = 404,
  TooManyRequests = 429,
  InternalServer = 500,
}

export default HttpStatus;
