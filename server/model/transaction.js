var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var transactionSchema = new Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    cart: {
        type: Array,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    date: {
        type: String
    },
    price : {
        type : Number,
        required : true
    }
})

var Transaction = mongoose.model('Transaction', transactionSchema);
module.exports = Transaction;