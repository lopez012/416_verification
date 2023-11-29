// Question Document Schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var QuestionSchema = new Schema({
    title: { type: String, required: true, maxlength: 100 },
    text: { type: String, required: true },
    tags: [{ type: Schema.Types.ObjectId, ref: 'Tag', required: true }],
    askedBy: { type: String, required: true, default: 'Anonymous' },
    askDate: { type: Date, default: Date.now },
    answers: [{ type: Schema.Types.ObjectId, ref: 'Answer' }],
    views: { type: Number, default: 0 },
});

QuestionSchema.virtual('url').get(function () {
    return '/posts/question/' + this._id;
});
QuestionSchema.virtual('answerCount').get(function() {
    return this.answers.length;
  });

module.exports = mongoose.model('Question', QuestionSchema);