const { z } = require('zod')

const validate = (schema) => {
    return async (req, res, next) => {
        try {
            req.body = schema.parse(req.body)
            next()
        }
        catch (err) {
            console.log(err)
            next(err)
        }
    }
}

module.exports = validate