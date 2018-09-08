var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var productSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    productionDate: {
        type: String,
        required: true
    },
    expirationDate: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        trim: true
    },
    discount: {
        type: Number,
        default: 0,
        trim: true
    },
    producer: {
        type: String,
        required: true
    },
    groceryStore: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Store'
    },
    productImage: {
        type: String,
        default: 'default'
    },
    count: {
        type: Number,
        required: true
    }
})

var Product = mongoose.model('Product', productSchema);
module.exports = Product;