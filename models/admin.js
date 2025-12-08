const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: [true, "First name is required"]
        },
        lastName: {
            type: String,
            required: [true, "Last name is required"]
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
            trim: true
        },
        password: {
            type: String,
            required: [true, "Password is required"],
        },
        role: {
            type: String,
            default: "admin"
        }
    },
    { timestamps: true }
);

const Admin = mongoose.model("Admin", adminSchema);

module.exports = Admin;
