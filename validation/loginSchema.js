const { z } = require('zod')

const loginSchema = z.object({
    uniEmail: z
        .string()
        .email()
        .endsWith("@psu.edu.eg", "Must be a university email"),

    password: z
        .string()
        .min(6, "Password must be at least 6 characters"),
})

module.exports = loginSchema;
