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
        .populate('answers')
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

module.exports = router;
