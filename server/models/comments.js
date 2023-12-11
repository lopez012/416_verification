// Comment Document Schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CommentSchema = new Schema({
    text: {type: String, required: true},
    commented_by:{type: Schema.Types.ObjectId, ref: 'User', required: true},
    comment_time:{type:Date , default:Date.now},
    upvotes: { type: [{ type: Schema.Types.ObjectId, ref: 'User' }], default: [] },  
    downvotes: { type: [{ type: Schema.Types.ObjectId, ref: 'User' }], default: [] },
});


module.exports = mongoose.model('Comment', CommentSchema);