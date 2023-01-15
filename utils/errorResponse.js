class ErrorResponse extends Error {
    constructor(message, statusCode) {
        super(Object.values(message).join(', '));
        this.statusCode = statusCode;
        this.originalError = message;
    }
}

module.exports = ErrorResponse;