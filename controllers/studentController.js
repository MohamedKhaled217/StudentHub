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

const getProfile = async (req, res, next) => {
    try {
        const { alias } = req.params;

        const student = await Student.findOne({ userName: alias })
            .select('-password -nationalId -scannedId');

        if (!student) {
            return next(new AppError('Student not found', 404));
        }

        const requesterId = req.studentPayload?.id;
        const requesterRole = req.studentPayload?.role; // ← علشان نعرف لو admin

        // admin 
        if (requesterRole === "admin") {
            return res.status(200).json({
                status: 'success',
                data: student
            });
        }

        // private 
        if (student.visibility === 'private' && student._id.toString() !== requesterId) {
            return next(new AppError('This profile is private', 403));
        }

        // students → logged in
        if (student.visibility === 'students' && !requesterId) {
            return next(new AppError('You must be logged in to view this profile', 401));
        }

        res.status(200).json({
            status: 'success',
            data: student
        });
    } catch (err) {
        next(err);
    }
};


const updateProfile = async (req, res, next) => {
    try {
        const { alias } = req.params;
        const requesterId = req.studentPayload?.id;
        const requesterRole = req.studentPayload?.role;

        const student = await Student.findOne({ userName: alias });

        if (!student) {
            return next(new AppError('Student not found', 404));
        }
        // admin
        const isAdmin = requesterRole === "admin";

        //  Owner 
        const isOwner = student._id.toString() === requesterId;

        if (!isAdmin && !isOwner) {
            return next(new AppError('You are not allowed to edit this profile', 403));
        }

        Object.assign(student, req.body);

        await student.save();

        res.status(200).json({
            status: 'success',
            data: student
        });

    } catch (err) {
        next(err);
    }
};



const logout = async (req, res, next) => {
    try {
        res.cookie('jwt', '', {
            httpOnly: true,
            expires: new Date(0)
        });

        res.status(200).json({
            status: 'success',
            message: 'Logged out successfully'
        });
    } catch (err) {
        next(err);
    }
};

const createProject = async (req, res, next) => {
    try {
        const studentId = req.studentPayload.id;
        const projectData = req.body;

        const student = await Student.findById(studentId);
        
        if (!student) {
            return next(new AppError('Student not found', 404));
        }

        // Add the new project to the projects array
        student.projects.push(projectData);
        await student.save();

        res.status(201).json({
            status: 'success',
            message: 'Project created successfully',
            data: student.projects[student.projects.length - 1]
        });
    } catch (err) {
        next(err);
    }
};

const editProject = async (req, res, next) => {
    try {
        const studentId = req.studentPayload.id;
        const { projectId } = req.params;
        const updateData = req.body;


        const student = await Student.findById(studentId);
        
        if (!student) {
            return next(new AppError('Student not found', 404));
        }

        // Find the project by _id
        const project = student.projects.id(projectId);
        
        if (!project) {
            return next(new AppError('Project not found', 404));
        }

        // Update project fields
        Object.assign(project, updateData);
        await student.save();

        res.status(200).json({
            status: 'success',
            message: 'Project updated successfully',
            data: project
        });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    createStudent,
    loginStudent,
    getProfile,
    updateProfile,
    logout,
    createProject,
    editProject
}