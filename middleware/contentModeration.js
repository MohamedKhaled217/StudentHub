const BannedWord = require('../models/BannedWord');

// Check if text contains banned words
exports.checkBannedWords = async (text) => {
  if (!text) return { clean: true, words: [] };
  
  const bannedWords = await BannedWord.find();
  const foundWords = [];
  
  const textLower = text.toLowerCase();
  
  for (let wordDoc of bannedWords) {
    const word = wordDoc.word.toLowerCase();
    // Use word boundaries to match whole words
    const regex = new RegExp(`\\b${word}\\b`, 'i');
    if (regex.test(textLower)) {
      foundWords.push(word);
    }
  }
  
  return {
    clean: foundWords.length === 0,
    words: foundWords
  };
};

// Middleware to validate profile content
exports.validateProfileContent = async (req, res, next) => {
  try {
    const { bio, interests } = req.body;
    const allText = [bio, ...(interests || [])].join(' ');
    
    const moderationResult = await exports.checkBannedWords(allText);
    
    if (!moderationResult.clean) {
      // Log flagged attempt
      const User = require('../models/User');
      if (req.session.user) {
        await User.findByIdAndUpdate(req.session.user._id, {
          $inc: { flaggedContentAttempts: 1 }
        });
      }
      
      req.session.error_msg = `Content contains inappropriate words: ${moderationResult.words.join(', ')}`;
      return res.redirect('back');
    }
    
    next();
  } catch (error) {
    console.error('Content moderation error:', error);
    next(error);
  }
};