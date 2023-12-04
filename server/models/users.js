// User Document Schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    email:{type:String, required:true, unique:true},
    username: { 
        type: String, 
        default: function() {return this.email;} 
    },
    hashed_password:{type: String, required: true},
    admin_privileges:{type:Boolean , default:false}
});

UserSchema.virtual('url').get(function() {
    return '/users/' + this._id;
});

module.exports = mongoose.model('User', UserSchema);