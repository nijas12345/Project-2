enum HTTP_statusCode {
  OK = 200,
  Created = 201,
  Accepted = 202,

  NoChange = 301,
  TaskFailed = 304,

  BadRequest = 400,
  Unauthorized = 401,
  NoAccess = 403,
  NotFound = 404,
  Conflict = 409,
  Expired = 410,
  UnprocessableEntity = 422,

  InternalServerError = 500,
  BadGateway = 502,
  ServiceUnavailable = 503,
  GatewayTimeout = 504,
  TooManyRequests = 429,
}

export default HTTP_statusCode;
