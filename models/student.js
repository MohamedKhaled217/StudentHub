const mongoose = require('mongoose');
const bcrypt = require('bcrypt')

const studentSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, 'First Name is Required'],
    },
    lastName: {
      type: String,
      required: [true, 'Last Name is Required'],
    },
    userName: {
      type: String,
      required: [true, 'Username is Required'],
      unique: true,
    },
    uniEmail: {
      type: String,
      required: [true, 'Email is Required'],
    },
    password: {
      type: String,
      required: [true, 'Password is Required'],
    },
    nationalId: {
      type: String,
      required: [true, 'National Id is Required'],
      unique: true,
    },
    scannedId: {
      type: String,
      required: [true, 'National ID Scan is Required'],
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    role: {
      type: String,
      default: 'student',
    },
    avatar: {
      type: String,
      default: ""
    },
    description: {
      type: String,
      default: "",
    },
    visibility: {
      type: String,
      enum: ['public', 'students', 'private'],
      default: 'public',
    },
    hobbies: {
      type: [String],
      default: [],
    },
    contact: {
      type: Object,
      default: {},
    },
    projects: [
      {
        title: {
          type: String,
          required: true,
        },
        description: {
          type: String,
          default: '',
        },
        technologies: {
          type: [String],
          default: [],
        },
        images: {
          type: [String],
          default: [],
        },
        githubLink: {
          type: String,
          default: '',
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

studentSchema.pre('save', async function () {
  if (!this.isModified('password')) return next()
  this.password = await bcrypt.hash(this.password, Number(process.env.SALT_ROUNDS))
})

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;
