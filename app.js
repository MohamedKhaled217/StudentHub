const dotenv = require('dotenv')
dotenv.config()   // to use .env
const express = require('express')
const { ConnectDB } = require('./dbConnect')
const cookieParser = require("cookie-parser");
const errorHandler = require('./utils/errorHandler');
const studentRoutes = require('./routes/studentRoutes')

// connect DB
ConnectDB()

// create express app
const app = express()

// view engine
app.set('view engine', 'ejs');
app.set('views')

// middlewares
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));


// API Routes
app.use('/api/student', studentRoutes)


// error middleware
app.use(errorHandler)

const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log(`server is listening on port ${port}`)
})