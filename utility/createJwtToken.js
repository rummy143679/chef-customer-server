const jwt = require('jsonwebtoken');

const createJwtToken = async (user) => {
    return await jwt.sign(user, process.env.JWT_KEY, { expiresIn: "1h" } )
}

module.exports = {createJwtToken}

const authenticateToken = (req, res, next) => {
    const autheHeader = req.headers['authorization'];
    const token = autheHeader && autheHeader.split(' ')[1];
    if (token == null) return res.sendStatus(401);

    jwt.verify(token, process.env.JWT_KEY, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}

module.exports = { createJwtToken, authenticateToken };