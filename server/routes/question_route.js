const router = require('express').Router();
const Question = require('../models/questions');


// Get all questions
router.route('/all').get(async (req, res) => {
  try {
    const questions = await Question.find().populate('tags').populate('answers');
    res.json(questions);
  } catch (err) {
    res.status(400).json('Error: ' + err);
  }
});

// Get the count of all questions
router.get('/count', async (req, res) => {
    try {
      const questionCount = await Question.countDocuments();
      res.json(questionCount);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
  
  /*
  // Get all questions
router.get('/all', async (req, res) => {
    try {
      const questions = await Question.find();
      res.json(questions);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
});
*/

// Get a question by ID
router.route('/:id').get(async (req, res) => {
  try {
    const question = await Question.findById(req.params.id).populate('tags').populate('answers');
    if (!question) {
      res.status(404).json({ error: 'Question not found' });
    } else {
      res.json(question);
    }
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



// Add a new question
router.route('/add').post(async (req, res) => {
  const { title, text, tags, askedBy } = req.body;

  try {
    const newQuestion = new Question({
      title,
      text,
      tags,
      askedBy,
    });

    await newQuestion.save();
    res.json('Question Added!');
  } catch (err) {
    res.status(400).json('Error: ' + err);
  }
});
//viewcount update
router.route('/:id/view').post(async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) {
      res.status(404).json({ error: 'Question not found' });
    } else {
      // Increment the view count
      question.views += 1;
      await question.save();
      res.json({ views: question.views });
    }
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
//end point for answers
router.route('/:id/answers').get(async (req, res) => {
    try {
      const question = await Question.findById(req.params.id);
      if (!question) {
        res.status(404).json({ error: 'Question not found' });
      } else {
        const answers = await Answer.find({ _id: { $in: question.answers } });
        res.json(answers);
      }
    } catch (err) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

module.exports = router;