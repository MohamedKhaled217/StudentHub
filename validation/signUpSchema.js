const { z } = require('zod')

const signUpSchema = z.object({
    firstName: z.string().min(2, "First name is too short"),
    lastName: z.string().min(2, "Last name is too short"),
    userName: z.string().min(3, "Username is too short"),

    password: z
        .string()
        .min(6, "Password must be at least 6 characters"),

    uniEmail: z
        .string()
        .email()
        .endsWith("@psu.edu.eg", "Must be a university email"),

    nationalId: z
        .string()
        .length(14, "National ID must be 14 digits")
        .regex(/^[0-9]+$/, "National ID must contain digits only"),
})

module.exports = signUpSchema;
