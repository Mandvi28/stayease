// A small helper class for throwing errors with an HTTP status code attached.
// Controllers throw this and the central error handler middleware reads
// `statusCode` off it to build the response.
class ApiError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
  }
}

module.exports = ApiError;
