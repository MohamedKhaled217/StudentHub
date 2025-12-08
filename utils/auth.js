const jwt = require('jsonwebtoken')
const appError = require('../utils/appError')

const signToken = async (payload) => {
    const token = await jwt.sign(payload,
        process.env.SECRET_KEY,
        {
            expiresIn: process.env.JWT_EXPIRES_IN
        })
    return token;
}


const protected = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        // token not exist
        if (!token) throw new appError("You are not logged in", 401)

        // verify token
        const decoded = await jwt.verify(token, process.env.SECRET_KEY)
        req.studentPayload = decoded
        next()
    }
    catch (err) {
        next(err)
    }
}


module.exports = {
    signToken,
    protected
}