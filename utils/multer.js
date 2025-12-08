const multer = require('multer')
const AppError = require('./appError')
const path = require('path')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (file.fieldname === 'scannedId') {
            cb(null, "public/uploads/ScannedId")
        } else if (file.fieldname === 'avatar') {
            cb(null, "public/uploads/avatars")
        } else {
            cb(new AppError('Invalid upload field', 400))
        }
    },
    filename: (req, file, cb) => {
        cb(null, `${file.originalname}-${Date.now()}${path.extname(file.originalname)}`)
    }
})

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
        cb(null, true);
    } else {
        cb(new AppError('Only PDF files are allowed', 400), false);
    }
}

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // 5 MB
});

module.exports = upload