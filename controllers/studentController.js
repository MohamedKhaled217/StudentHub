const Student = require('../models/student');
const appError = require('../utils/appError');
const AppError = require('../utils/appError')
const bcrypt = require('bcrypt')
const jwtMiddleware = require('../utils/auth')

const createStudent = async (req, res, next) => {
    try {
        const data = req.body;
        const scannedId = req.file;

        if (!scannedId) {
            return next(new AppError('National ID scan is required', 400));
        }

        const newStudent = {
            firstName: data.firstName,
            lastName: data.lastName,
            userName: data.userName,
            uniEmail: data.uniEmail,
            password: data.password,
            nationalId: data.nationalId,
            scannedId: scannedId.filename
        };

        const studentDoc = await Student.create(newStudent);

        console.log("Created student successfully:", studentDoc);

        res.status(201).json({
            status: 'success',
            data: studentDoc
        });
    } catch (err) {
        next(err);
    }
}

const loginStudent = async (req, res, next) => {
    try {
        const data = req.body
        const student = await Student.findOne({ uniEmail: data.uniEmail })
        if (!student) throw new appError("invalid credentials", 400)
        const checkPassword = await bcrypt.compare(data.password, student.password)
        if (!checkPassword) throw new appError("invalid credentials", 400)
        if (student.status === "pending")
            throw new appError("Your account is not approved yet", 400)
        else if (student.status == "rejected")
            throw new appError("Your request has been rejected , Sign up again", 400)
        else {
            const payload = {
                id: student._id,
                role: student.role
            }
            const token = await jwtMiddleware.signToken(payload)
            console.log("user logged in successfully\n", token)
            res.cookie('jwt', token, {
                httpOnly: true,
                maxAge: Number(process.env.COOKIE_EXPIRES_IN)
            })
            res.status(200).json({
                status: "success",
                data: {
                    Id: student._id,
                    UniEmail: student.uniEmail,
                    token
                }
            })                  // redirect user to /profile/username
        }
    }
    catch (err) {
        next(err)
    }
}

module.exports = {
    createStudent,
    loginStudent
}