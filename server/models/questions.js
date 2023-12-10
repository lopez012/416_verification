// Question Document Schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var QuestionSchema = new Schema({
    title: { type: String, required: true, maxlength: 100 },
    summary: {type: String, required: true, maxlength: 140 } ,
    text: { type: String, required: true },
    tags: [{ type: Schema.Types.ObjectId, ref: 'Tag', required: true }],
    askedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    askDate: { type: Date, default: Date.now },
    answers: [{ type: Schema.Types.ObjectId, ref: 'Answer' }],
    views: { type: Number, default: 0 },
    upvotes: { type: [{ type: Schema.Types.ObjectId, ref: 'User' }], default: [] },  
    downvotes: { type: [{ type: Schema.Types.ObjectId, ref: 'User' }], default: [] },  
});

QuestionSchema.virtual('url').get(function () {
    return '/posts/question/' + this._id;
});
QuestionSchema.virtual('answerCount').get(function() {
    return this.answers.length;
  });

module.exports = mongoose.model('Question', QuestionSchema);