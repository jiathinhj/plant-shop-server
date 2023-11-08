const jwt = require('jsonwebtoken')

const jwtVerify = (token, key) => {
    let r = {};
    jwt.verify(
        token,
        key,
        (error, decoded) => {
            r.error = error;
            r.decoded = decoded
        }
    )
    return r;
}

module.exports = { jwtVerify }