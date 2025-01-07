const jwt = require("jsonwebtoken");

module.exports = (req, resp, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decodedToken = jwt.verify(token, "MIIEvQIBADANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQ");
        const userId = decodedToken.userId;
        req.auth = {
            userId : userId
        };
    } catch (error) {
        resp.status(401).json({ error });
    }
    next();
}