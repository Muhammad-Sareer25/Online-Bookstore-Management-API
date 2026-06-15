const logger = (req, res, next) => {
    const method = req.method;
    const endpoint = req.originalUrl;
    const dateTime = new Date().toISOString();

    console.log(`[${dateTime}] ${method} ${endpoint}`);

    next();
};

module.exports = logger;