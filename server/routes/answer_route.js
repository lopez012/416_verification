const router = require('express').Router();
let Answer = require('../models/answers');
let Question = require('../models/questions');

router.route('/').get((req,res)=>{
    Answer.find()
        .then(answers=> res.json(answers))
        .catch(err => res.status(400).json('error: ' + err));
});

router.route('/add').post((req, res)=> {
    const text = req.body.text;
    const ans_by = req.body.ans_by;
    const ans_date_time = Date.parse(req.body.ans_date_time);

    const newAnswer = new Answer({
        text,
        ans_by,
        ans_date_time,
    });

    newAnswer.save()
        .then(answer => {
            return Question.findByIdAndUpdate(req.body.questionId,{ $push:{answers: answer._id}}, {new:true});
        })
        .then(()=>res.json('Answer Added!'))
        .catch(err => res.status(400).json('error: ' + err));
}); 

//return answers for a given question
router.route('/question/:id').get((req,res)=>{
    Question.findById(req.params.id)
        .populate({
            path: 'answers', 
            populate: [
              {
                  path: 'ans_by',
                  model: 'User' 
              },
              {
                  path: 'comments', 
                  model: 'Comment' 
              }
          ]
        })
        .then( question=>{
            if(!question){
                return res.status(404).json('question not found');
            }
            res.json(question.answers);
        })
        .catch(err=> res.status(400).json('error: '+err));
    
});


router.route('/:id').get((req,res)=>{
    Answer.findById(req.params.id)
        .then(answer => res.json(answer))
        .catch(err => res.status(400).json('error: '+ err));
});

router.route('/:aid/:userId/upvote').post(async (req, res) => {
    console.log("hello");
    const { aid, userId } = req.params;
    console.log(aid);
    console.log(userId);

    try {
      const answer = await Answer.findById(aid);
      if (!Answer) {
        res.status(404).json({ error: 'Question not found' });
      } else {
        const isUpvoted = answer.upvotes.includes(userId);
        const isDownvoted = answer.downvotes.includes(userId);
  
        if (!isUpvoted) {
          // Add the upvote
          answer.upvotes.push(userId);

          // If user has downvoted before, remove the downvote
          if (isDownvoted) {
            answer.downvotes.pull(userId);
            await answer.save();
            res.json({ message: '+15' });
          }
          else {
            await answer.save();
            res.json({ message: '+5' });
          }
        } else {
          // Remove the upvote
          answer.upvotes.pull(userId);
          await answer.save();
          res.json({ message: '-5' });
        }
      }
    } catch (err) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  router.route('/:aids/:change/change').post(async (req, res) => {
    const { aids, change } = req.params;
  
    try {
      // Find the answer by ObjectId
      const answer = await Answer.findById(aids);
  
      if (!answer) {
        return res.status(404).json({ error: 'Answer not found' });
      }
  
      // Update the text content of the answer
      answer.text = change;
  
      // Save the updated answer
      await answer.save();
  
      res.json({ message: 'Answer updated successfully', updatedAnswer: answer });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  //delete answers and extract comment arrays
  router.route('/:aids/delete').post(async (req, res) => {
    try {
      const answerIds = req.params.aids.split(',');
  
      // Find and delete multiple answers by their IDs
      const deletedAnswers = await Answer.find({ _id: { $in: answerIds } }).lean();
  
      // Extract and merge comment arrays from deleted answers
      const commentArrays = deletedAnswers.reduce((acc, answer) => {
        if (answer.comments && answer.comments.length > 0) {
          acc.push(...answer.comments.map(comment => comment.toString()));
        }
        return acc;
      }, []);
  
      // Delete the answers
      await Answer.deleteMany({ _id: { $in: answerIds } });
  
      res.json({ answerIds, commentArrays });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  // Add a downvote to a question
  router.route('/:aid/:userId/downvote').post(async (req, res) => {

      const { aid, userId } = req.params;
    try {
      const answer = await Answer.findById(aid);
      if (!answer) {
        res.status(404).json({ error: 'Question not found' });
      } else {
        const isUpvoted = answer.upvotes.includes(userId);
        const isDownvoted = answer.downvotes.includes(userId);
  
        if (!isDownvoted) {
          // Add the downvote
          answer.downvotes.push(userId);
  
          // If user has upvoted before, remove the upvote
          if (isUpvoted) {
            answer.upvotes.pull(userId);
            await answer.save();
            res.json({ message: '-15' });
          }
          else {
            await answer.save();
            res.json({ message: '-10' });
          }
  
        } else {
          // Remove the downvote
          answer.downvotes.pull(userId);
          await answer.save();
          res.json({ message: '+10' });
        }
      }
    } catch (err) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  

module.exports = router;
