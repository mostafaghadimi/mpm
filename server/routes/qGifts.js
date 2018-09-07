var express = require('express')
var router = express.Router();

var QGift = require('./../model/qGift');

router.post('/validate',(req,res) => {
    var qGId = req.body.qGID;
    QGift.findByIdAndRemove(qGId, (err,qGift) => {
        if(err || !qGift){
            return res.send({
                success : false,
                message : "کیو گیفت نامعتبر"
            });
        }
        return res.send({
            success : true,
            message : "کیو گیفت معتبر",
            info : qGift.credit
        })
        
    });
});