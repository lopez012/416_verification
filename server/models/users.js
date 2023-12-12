// User Document Schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    email:{type:String, required:true, unique:true},
    username: { 
        type: String, required:true, unique:true,
        default: function() {return this.email;} 
    },
    hashed_password:{type: String, required: true},
    role: {
        type: String, 
        default: "regular",
        enum: ["guest", "regular", "admin"]
    },
    reputation:{type: Number, default: 0},
    member_since:{type: Date, default: Date.now}
});

UserSchema.virtual('url').get(function() {
    return '/users/' + this._id;
});

module.exports = mongoose.model('User', UserSchema);