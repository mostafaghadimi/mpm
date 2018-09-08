var express = require('express');
var router = express.Router();

var crypto = require('crypto');
var User = require('./../model/user');
var DiscountToken = require('./../model/discountToken');

router.post('/generate', (req, res, next) => {
    var discount = req.body.discount;
    var userId = req.body.userID;
    var token = req.body.token;

    User.findOne({
        _id: userId
    }, function (err, user) {
        if (err || !user) {
            console.log(err);
            return res.send({
                success : false,
                message : "کاربر نامعتبر"
            });
        }
        var tokenData = {
            userId: userId,
            token: token,
            discount : discount
        };

        DiscountToken.create(tokenData, function (error, token) {
            if(error){
                return res.send({
                    success : false,
                    message : "خطای ذخبره سازی"
                });
            }
            return res.json(token);
        });
    });
});

router.post('/validateToken/',(req,res) => {
    var token = req.body.token;
    var userId = req.body.userID;
    DiscountToken.findOne({token : token} , function(err, token){
        if(err || !token || token.userId != userId){
            return res.send({
                success : false,
                message : "کدتخفیف نامعتبر",
            });
        }
        return res.send({
            success : true,
            message : "کدتخفیف معتبر",
            info : token.discount
        })
    });
});

module.exports = router;