// Answer Document Schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AnswerSchema = new Schema({
    text: {type: String, required: true},
    ans_by:{type: String, required: true},
    ans_date_time:{type:Date , default:Date.now},
    upvotes: { type: [{ type: Schema.Types.ObjectId, ref: 'User' }], default: [] },  
    downvotes: { type: [{ type: Schema.Types.ObjectId, ref: 'User' }], default: [] },
});

AnswerSchema.virtual('url').get(function() {
    return '/posts/answer/' + this._id;
});

module.exports = mongoose.model('Answer', AnswerSchema);

