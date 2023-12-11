const router = require('express').Router();
const comments = require('../models/comments');
let Comment = require('../models/comments');
let User = require('../models/users');


let Answer = require('../models/answers');
let Question = require('../models/questions');

router.route('/question/add').post((req, res)=> {
    const text = req.body.text;
    const commented_by = req.body.commented_by;
    const comment_time = Date.parse(req.body.comment_time);

    const newComment = new Comment({
        text,
        commented_by,
        comment_time,
    });

    newComment.save()
        .then(comment => {
            return Question.findByIdAndUpdate(req.body.questionId,{ $push:{comments: comment._id}}, {new:true});
        })
        .then(() => res.json('comment added to question!'))
        .catch(err=> res.status(400).json('error' + err));
});
router.route('/answer/add').post((req, res)=> {
    const text = req.body.text;
    const commented_by = req.body.commented_by;
    const comment_time = Date.parse(req.body.comment_time);

    const newComment = new Comment({
        text,
        commented_by,
        comment_time,
    });

    newComment.save()
        .then(comment => {
            return Answer.findByIdAndUpdate(req.body.answerId,{ $push:{comments: comment._id}}, {new:true});
        })
        .then(() => res.json('comment added to answer!'))
        .catch(err=> res.status(400).json('error' + err));
});
router.route('/:comment_id/username').get((req, res) => {
    const commentId = req.params.comment_id;

    Comment.findById(commentId)
        .populate('commented_by', 'username') 
        .then(comment => {
            if (!comment) {
                return res.status(404).json({ message: 'Comment not found' });
            }
            res.json({ username: comment.commented_by.username });
        })
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/:cids/delete').post(async (req, res) => {
    try {
      const commentIds = req.params.cids.split(',');
  
      // Find and delete multiple comments by their IDs
      const deletedComments = await Comment.deleteMany({ _id: { $in: commentIds } });
  
      res.json(deletedComments);
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

module.exports = router;


