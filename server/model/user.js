var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema ({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    credit: {
        type: Number,
        default: 0
    }
})

var User = mongoose.model('User', userSchema);
module.exports = User;