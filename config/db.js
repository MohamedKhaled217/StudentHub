const mongoose = require('mongoose');
const User = require('../models/User');
const BannedWord = require('../models/BannedWord');
const bcrypt = require('bcryptjs');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/student_hub', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('MongoDB Connected Successfully');

        // Initialize admin and banned words
        await initializeData();
    } catch (err) {
        console.error('MongoDB Connection Error:', err);
        process.exit(1);
    }
};

const initializeData = async () => {

    // Create default admin if not exists
    const adminExists = await User.findOne({ email: 'admin@eng.psu.edu' });
    if (!adminExists) {
        const hashedPassword = await bcrypt.hash('Admin123!', 10);
        await User.create({
            name: 'System Administrator',
            email: 'admin@eng.psu.edu',
            password: hashedPassword,
            role: 'admin',
            status: 'approved',
            studentId: 'ADMIN001'
        });
        console.log('Default admin created');
    }

    // Create default banned words if not exists
    const bannedWordsCount = await BannedWord.countDocuments();
    if (bannedWordsCount === 0) {
        const defaultBannedWords = [
            'inappropriate', 'offensive', 'hate', 'violence', 'drugs',
            'alcohol', 'weapon', 'illegal', 'scam', 'fraud'
        ];
        await BannedWord.insertMany(
            defaultBannedWords.map(word => ({ word: word.toLowerCase() }))
        );
        console.log('Default banned words created');
    }
};

connectDB();

module.exports = mongoose.connection;