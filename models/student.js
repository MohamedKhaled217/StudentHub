const mongoose = require('mongoose')

const studentSchema = mongoose.Schema({
    firstName: {
        type: string,
        required: [true, 'First Name is Required'],
    },
    lastName: {
        type: string,
        required: [true, 'Last Name is Required'],
    },
    userName: {
        type: string,
        required: [true, 'Last Name is Required'],
        unique: true
    },
    nationalId: {
        type: string,
        required: [true, 'National Id is Required'],
        unique: true
    },
    nationalIdScan: {
        type: string,
        required: [true]
    },
    status: {
        type: string,
        default: "pending"
    },
    avatar: {
        type: string
    },
    description: {
        type: string,
        default: ""
    },
    hobbies: [],
    contact: {},
    timestamps: true
})

const Student = mongoose.model(studentSchema);

module.exports = { Student }