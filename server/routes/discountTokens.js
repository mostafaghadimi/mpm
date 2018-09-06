var express = require('express');
var router = express.Router();

var crypto = require('crypto');
var User = require('./model/user');
var DiscountToken = require('./model/discountToken');

router.post('/generate', (req, res, next) => {
    var discount = req.body.discount;
    var userId = req.body.userId;
    var discount = req.body.discount;

    User.findOne({
        _id: userId
    }, function (err, user) {
        if (err) {
            return next(err);
        }
        if (!user) {
            var err = Error('User not found');
            err.status = 400;
            return next(err);
        }
        var tokenData = {
            userId: userId,
            token: crypto.randomBytes(8).toString('hex'),

        };

        DiscountToken.create(tokenData, function (error, token) {
            if(error){
                return res.status(500).send({ msg: err.message });
            }
            res.json(token);
        });
    });
});

router.post('/validateToken/',(req,res) => {
    var token = req.body.token;
    var userId = req.body.userId;
    DiscountToken.findOne({token : token} , function(err, token){
        if(err || !token || token.userId != userId){
            res.send({
                success : false,
                message : "کدتخفیف نامعتبر",
            });
        }
        res.send({
            success : true,
            message : "کدتخفیف معتبر",
            info : token.discount
        })
    });
});