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
    const createdBy = req.body.createdBy;
    const newTag = new Tag({name, createdBy});

    newTag.save()
        .then(()=> res.json('Tag Added!'))
        .catch(err => res.status(400).json('error: '+ err));
});

router.get('/:uid/getCreation', async (req, res) => {
  const { uid } = req.params;

  try {
    // Find tags with createdBy field matching uid
    const tags = await Tag.find({ createdBy: uid });

    res.json({ tags });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


router.delete('/:tid/delete', async (req, res) => {
  try {
    const tid = req.params.tid;

    // Find the tag by ID and remove it
    const deletedTag = await Tag.findByIdAndDelete(tid);
    console.log(deletedTag);
    if (!deletedTag) {
      return res.status(404).json({ message: 'Tag not found' });
    }

    res.json({ message: 'Tag deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
})

router.route('/:tid/:change/change').post(async (req, res) => {
  const { tid, change } = req.params;

  try {
    // Find the tag by ObjectId
    const tag = await Tag.findById(tid);

    if (!tag) {
      return res.status(404).json({ error: 'Tag not found' });
    }

    // Update the name of the tag
    tag.name = change;

    // Save the updated tag
    await tag.save();

    res.json({ message: 'Tag updated successfully', updatedTag: tag });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
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

router.route('/tagNames/:tagids').get(async (req, res) => {
  try {
    const tagIds = req.params.tagids.split(',');

    // Find tags by IDs
    const tags = await Tag.find({ _id: { $in: tagIds } });

    // Extract tag names
    const tagNames = tags.map(tag => tag.name);

    // Concatenate tag names with a space separator
    const result = tagNames.join(' ');

    res.send(result);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;