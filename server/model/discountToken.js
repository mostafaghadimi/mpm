var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var discountTokenSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    token: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now,
        expires: 86400
    },
    discount :{
        type : Number,
        required : true
    }
});

var DiscountToken = mongoose.model('DiscountToken', discountTokenSchema);
module.exports = DiscountToken;