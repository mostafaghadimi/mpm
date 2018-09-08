var express = require('express')
var router = express.Router();

var QGift = require('./../model/qGift');
var User = require('./../model/user');

router.post('/generate',(req,res) => {
    var credit = req.body.credit;
    QGift.create({credit : credit},(err, qGift) => {
        if(err){
            return res.send({
                success : false,
                message : "خطا در ساختن"
            })
        }
        return res.json(qGift);
    });
});

router.post('/validate',(req,res) => {
    var qGId = req.body.qGID;
    var userID = req.body.userID;
    QGift.findByIdAndRemove(qGId, (err,qGift) => {
        if(err || !qGift){
            return res.send({
                success : false,
                message : "کیو گیفت نامعتبر"
            });
        }
        User.findById(userID,(err,user) => {
            if(err || !user){
                return res.send({
                    success : false,
                    message : "کاربر نامعتبر"
                })
            }
            user.credit += qGift.credit;
            user.save(err => {
                if(err){
                    return res.send({
                        success : false,
                        message : "خطای ذخیره سازی"
                    })
                }
                return res.send({
                    success : true,
                    message : "کیف پول شما "+qGift.credit+" تومان شارژ شد.",
                    info : qGift.credit
                })
            });
        })
    });
});


module.exports = router;