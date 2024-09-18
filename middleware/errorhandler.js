const { constants } = require('../constants')

const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode ? res.statusCode : 500;
    switch (statusCode) {
        case constants.VALIDATION_ERROR:
            res.status(statusCode).json({
                title: "validation failed",
                message: err.message,
                stackTrace: err.stack
            });

        case constants.NOT_FOUND:
            res.status(statusCode).json({
                title: "NOT FOUND",
                message: err.message,
                stackTrace: err.stack
            });
        case constants.UNAUTHORIZED:
            res.status(statusCode).json({
                title: "UNAUTHORIZED",
                message: err.message,
                stackTrace: err.stack
            });

        case constants.FORBIDDEN:
            res.status(statusCode).json({
                title: "FORBIDDEN",
                message: err.message,
                stackTrace: err.stack
            });

        case constants.SERVER_ERROR:
            res.status(statusCode).json({
                title: "SERVER ERROR",
                message: err.message,
                stackTrace: err.stack
            });

        default:
            console.log("NO ERROR")
            break;
    }
};
module.exports = errorHandler;
