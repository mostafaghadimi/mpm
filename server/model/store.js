var mongoose = require('mongoose')
var Schema = mongoose.Schema;

var storeSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    location: {
        latitude: {
            type: Number,
            required: true
        },
        longtitude: {
            type: Number,
            required: true
        }
    },
    deviceToken: {
        type: String,
        required: true
    }
})