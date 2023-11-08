const jwt = require('jsonwebtoken')

const verifyEmailToken = (signUpData) => {
    const token = jwt.sign(
        signUpData,
        process.env.TOKEN_SECRET,
        { expiresIn: 60 * 10 } // expires in 10 minutes
    )
    return token
}

module.exports = {
    verifyEmailToken
}