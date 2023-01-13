const errorHandler = (err, req, res, next) => {
    // log to console for dev
    console.log(err.stack.red);

    res.status(err.statusCode || 500).json({
        success: false,
        error: err.message || 'Server'
    });
}

module.exports = errorHandler;