// Tag Document Schema

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TagSchema = new Schema({
    name: {type: String, required: true, unique: true},
    createdBy: {type: Schema.Types.ObjectId, ref: 'User', required: true},
});

TagSchema.virtual('url').get(function() {
    return '/posts/tag/' + this._id;
});

module.exports = mongoose.model('Tag', TagSchema);

