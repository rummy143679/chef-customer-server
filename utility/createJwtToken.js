const jwt = require('jsonwebtoken');

const createJwtToken = async (user) => {
    console.log(user)
    return await jwt.sign(user, process.env.JWT_KEY, { expiresIn: "1h" } )
}

module.exports = {createJwtToken}