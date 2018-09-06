var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var transactionSchema = new Schema ({
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
        // set moment.now for default
    }, 
    tokenDiscount: {
        type: Number,
        default: 0
    }
})

var Transaction = mongoose.model('Transaction', transactionSchema);
module.exports = Transaction;