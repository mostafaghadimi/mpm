var mongoose = require('mongoose')
var Schema = mongoose.Schema;

var storeSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    location: {
        lat: {
            type: Number,
            required: true
        },
        lon: {
            type: Number,
            required: true
        }
    },
    deviceToken: {
        type: String,
        required: true
    },
    address : {
        type : String,
    },
    picture : {
        type : String
    }
})

var Store = mongoose.model('Store', storeSchema);
module.exports = Store;