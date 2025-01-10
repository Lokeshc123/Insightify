class CustomError extends Error {
  constructor(statusCode, message) {
    console.log("CustomError: ", message);
    console.log("CustomError: ", statusCode);
    super(message);
    this.statusCode = statusCode;
  }
}

module.exports = CustomError;
