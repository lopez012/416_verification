const router = require('express').Router();
let Tag = require('../models/tags');
let Question = require('../models/questions');

router.route('/').get((req,res)=> {
    Tag.find()
        .then(tags => res.json(tags))
        .catch(err => res.status(400).json('error: '+ err));
});

router.route('/:tagname').get((req, res) => {
    const tagName = req.params.tagname;
    Tag.findOne({ name: tagName })
      .then(tag => res.json(tag))
      .catch(err => res.status(400).json('error: ' + err));
  });
  
  router.route('/:tagname/01').get((req, res) => {
    const tagName = new RegExp('^' + req.params.tagname + '$', 'i'); // Case-insensitive regex
    Tag.findOne({ name: { $regex: tagName } })
      .then(tag => res.json(tag))
      .catch(err => res.status(400).json('error: ' + err));
});
router.route('/add').post((req,res)=>{
    const name = req.body.name;

    const newTag = new Tag({name});

    newTag.save()
        .then(()=> res.json('Tag Added!'))
        .catch(err => res.status(400).json('error: '+ err));
});
router.route('/count').get(async (req, res) => {
  try {
    const tags = await Tag.find();
    res.json({ tags });
  } catch (err) {
    console.error('Error fetching tags:', err);
    res.status(500).json({ error: 'Error fetching tags: ' + err.message });
  }
});
// number of questions per given tag
router.route('/tag/count/:id').get((req,res)=>{
    
    Question.countDocuments({tags: req.params.id})
        .then(count=> res.json({count: count}))
        .catch(err=> res.status(400).json('Error: '+ err.message));
        

});
//get questions that have specifed tag_id TODO
router.route('/tag/:tagid').get((req,res)=>{ 
    Question.find({tags: req.params.tagid}).populate('tags')
        .then(questions => res.json(questions))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/:id').get((req,res)=>{
    Tag.findById(req.params.id)
        .then(tag=> res.json(tag))
        .catch(err=> res.status(400).json('error: '+err));

});


module.exports = router;