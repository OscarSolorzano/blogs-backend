class AppError extends Error {
  constructor(message, statusCode) {
    super(message);

    this.message = message;
    this.statusCode = statusCode;
    // Status = error 4XX --> client || fail 5XX -> server
    this.status = `${statusCode}`.startsWith('4') ? 'error' : 'fail';

    // Capture the error stack and add it to the AppError instance
    Error.captureStackTrace(this);
  }
}

module.exports = { AppError };
