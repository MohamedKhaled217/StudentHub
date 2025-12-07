const mongoose = require('mongoose')
const logger = require("pino")({
    transport: {
        target: "pino-pretty",
        options: {
            colorize: true
        }
    }
})



const URI = process.env.DB_URI
const ConnectDB = async function () {
    try {
        await mongoose.connect(URI)
        console.log(`DB Connected\n`)
    }
    catch (err) {
        console.log(`DB Coneection Failed`, err)
        process.exit(1)
    }
}

module.exports = { ConnectDB };