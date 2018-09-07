var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var QGiftSchema = new Schema({
    credit: {
        type: Number,
        required: true
    }
});

var QGift = mongoose.model('QGift', QGiftSchema);
module.exports = QGift;