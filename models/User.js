const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  studentId: {
    type: String,
    required: true,
    unique: true
  },
  studentIdDocument: {
    type: String, // Path to uploaded document
    default: null
  },
  role: {
    type: String,
    enum: ['student', 'admin'],
    default: 'student'
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  profilePhoto: {
    type: String,
    default: null
  },
  bio: {
    type: String,
    default: '',
    maxlength: 500
  },
  interests: [{
    type: String
  }],
  contactInfo: {
    phone: String,
    linkedin: String,
    github: String,
    portfolio: String
  },
  skills: [{
    name: String,
    level: {
      type: Number,
      min: 0,
      max: 100
    }
  }],
  projects: [{
    name: String,
    description: String,
    githubLink: String,
    liveLink: String
  }],
  visibility: {
    type: String,
    enum: ['public', 'university', 'private'],
    default: 'public'
  },
  flaggedContentAttempts: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Create unique slug for profile URL
userSchema.virtual('slug').get(function() {
  return this.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
});

// Ensure virtuals are included in JSON
userSchema.set('toJSON', { virtuals: true });
userSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('User', userSchema);