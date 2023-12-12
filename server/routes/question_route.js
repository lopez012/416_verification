const router = require('express').Router();
const Question = require('../models/questions');
const Tag = require('../models/tags');
const Answer = require('../models/answers');

// Get all questions
router.route('/all').get(async (req, res) => {
  try {
    const questions = await Question.find().populate('tags').populate('answers').populate('comments');
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
    const question = await Question.findById(req.params.id).populate('tags').populate('answers').populate('comments');
    if (!question) {
      res.status(404).json({ error: 'Question not found' });
    } else {
      res.json(question);
    }
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.route('/modify').post(async (req, res) => {
  try {
    const { id, title, text, summary } = req.body;

    // Find the question by ID and update its properties
    const updatedQuestion = await Question.findByIdAndUpdate(
      id,
      { title, text, summary },
      { new: true } // This ensures that the updated document is returned
    );

    if (!updatedQuestion) {
      return res.status(404).json({ error: 'Question not found' });
    }

    res.json(updatedQuestion);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/tagmodify', async (req, res) => {
  try {
    const { id, tags } = req.body;

    // Find the question by ID
    const question = await Question.findById(id);

    if (!question) {
      return res.status(404).json({ error: 'Question not found' });
    }

    // Clear the existing tags array
    question.tags = [];

    // Iterate through the tags array
    for (const tagName of tags) {
      // Find or create the tag
      let tag = await Tag.findOne({ name: tagName });

      if (!tag) {
        // Create the tag if it doesn't exist
        tag = await Tag.create({ name: tagName });
      }

      // Add the tag's ID to the question's tags array
      question.tags.push(tag._id);
    }

    // Save the modified question
    await question.save();

    res.status(200).json({ message: 'Question tags modified successfully' });
  } catch (error) {
    console.error('Error modifying question tags:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
// Add a new question
router.route('/add').post(async (req, res) => {
  const { title, text, tags, askedBy, summary } = req.body;
  
  try {
    const newQuestion = new Question({
      title,
      text,
      tags,
      askedBy,
      summary 
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



  router.route('/:qid/:userId/upvote').post(async (req, res) => {
    console.log("hello");
    const { qid, userId } = req.params;
    console.log(qid);
    console.log(userId);
    try {
      const question = await Question.findById(qid);
      if (!question) {
        res.status(404).json({ error: 'Question not found' });
      } else {
        const isUpvoted = question.upvotes.includes(userId);
        const isDownvoted = question.downvotes.includes(userId);
  
        if (!isUpvoted) {
          // Add the upvote
          question.upvotes.push(userId);
          // If user has downvoted before, remove the downvote
          if (isDownvoted) {
            question.downvotes.pull(userId);
            await question.save();
            res.json({ message: '+15' });
          }else {
          await question.save();
          res.json({ message: '+5' });
          }
        } else {
          // Remove the upvote
          question.upvotes.pull(userId);
          await question.save();
          res.json({ message: '-5' });
        }
      }
    } catch (err) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  

  router.route('/:userId/names').get(async (req, res) => {
    try {
      const userId = req.params.userId;
  

      const questions = await Question.find({ askedBy: userId });
      
  
      res.json({ questions });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  
router.route('/:userId/getanswers').get(async (req, res) => {
  const userId = req.params.userId;

  try {
    // Find all questions
    const allQuestions = await Question.find();

    // Extract all unique answer IDs from all questions
    const allAnswerIds = allQuestions.reduce((acc, question) => {
      return acc.concat(question.answers.map(answer => answer.toString()));
    }, []);

    const uniqueAnswerIds = [...new Set(allAnswerIds)];

    // Find answers where ans_by is equal to userId
    const userAnswers = await Answer.find({
      _id: { $in: uniqueAnswerIds },
      ans_by: (userId)
    });

    // Get answer IDs where ans_by is equal to userId
    const userAnswerIds = userAnswers.map(answer => answer._id.toString());

    // Find questions where answers array contains userAnswerIds
    const userQuestions = allQuestions.filter(question => {
      return question.answers.some(answerId => userAnswerIds.includes(answerId.toString()));
    });

    // Return the array of questions
    res.json({ questions: userQuestions });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});



  // Add a downvote to a question
  router.route('/:qid/:userId/downvote').post(async (req, res) => {

      const { qid, userId } = req.params;
    try {
      const question = await Question.findById(qid);
      if (!question) {
        res.status(404).json({ error: 'Question not found' });
      } else {
        const isUpvoted = question.upvotes.includes(userId);
        const isDownvoted = question.downvotes.includes(userId);
  
        if (!isDownvoted) {
          // Add the downvote
          question.downvotes.push(userId);
          
  
          // If user has upvoted before, remove the upvote
          if (isUpvoted) {
            question.upvotes.pull(userId);
            await question.save();
            res.json({ message: '-15' });
          }
          else {
            await question.save();
            res.json({ message: '-10' });
          }

        } else {
          // Remove the downvote
          question.downvotes.pull(userId);
          await question.save();
          res.json({ message: '+10' });
        }
      }
    } catch (err) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  //delete a question and extract comments/anser
  router.route('/:qid/delete').post(async (req, res) => {
    try {
      const questionId = req.params.qid;
  
      // Find the question by ID
      const question = await Question.findById(questionId);
  
      // Extract arrays of comment and answer object IDs
      const commentIds = question.comments.map(comment => comment._id);
      const answerIds = question.answers.map(answer => answer._id);
  
      // Delete the question
      await Question.findByIdAndDelete(questionId);
  
      res.json({ commentIds, answerIds });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

module.exports = router;