const BannedWord = require('../models/BannedWord');
const User = require('../models/User');

// Check if text contains banned words
exports.checkBannedWords = async (text) => {
  if (!text) return { clean: true, words: [] };

  const bannedWords = await BannedWord.find(); // array of docs
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


const incAttempts = async (req) => {
  if (req.session.user) {
    await User.findByIdAndUpdate(req.session.user._id, {
      $inc: { flaggedContentAttempts: 1 } // increment 
    });
  }
}

// Middleware to validate profile content
exports.validateProfileContent = async (req, res, next) => {
  try {
    const { bio, interests } = req.body;

    const BioCheck = await exports.checkBannedWords(bio);
    const interestsCheck = await exports.checkBannedWords(interests);

    if (!BioCheck.clean) {
      // Log flagged attempt
      await incAttempts(req)
      req.session.error_msg = `Bio Content contains inappropriate words: ${BioCheck.words.join(', ')}`;
      return res.redirect('back');
    }

    if (!interestsCheck.clean) {
      // Log flagged attempt
      await incAttempts(req)
      req.session.error_msg = `interests Content contains inappropriate words: ${interestsCheck.words.join(', ')}`;
      return res.redirect('back');
    }

    next();
  } catch (error) {
    console.error('Content moderation error:', error);
    next(error);
  }
};