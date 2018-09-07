var express = require('express');
var router = express.Router();

var Product = require('../model/product');
var Transaction = require('../model/transaction');
var User = require('../model/user');

router.post('/validation', (req, res) => {
    var flag = false;
    for (var i = 0; i < req.body.cart.length; i++) {
        Product.findOne({
            _id: req.body.cart[i]._id
        }).exec((err, result) => {
            if (req.body.cart[i].count > result.count) {

                return res.send({
                    // TODO: return unavailable goods
                    message: 'برخی از کالاها موجود نیستند',
                    success: false
                })
            }
        })

    }

    return res.send({
        message: 'سبد خرید تایید شد',
        success: true,
        information: req.body.cart
    })

});

router.post('/payment/wallet', (req, res) => {
    var finalPrice = req.body.finalPrice;
    var userID = req.body.userID;
    User.findOne({
        _id: userID
    }, (err, user) => {
        if (err || !user) {
            res.send({
                success: false,
                message: 'کاربر نامعتبر است'
            })
        } else {
            if(user.credit < finalPrice){
                return res.send({
                    success : false,
                    message :"موجودی کمتر از مبلغ است"
                })
            }
            user.credit -= finalPrice;
            user.save((err) => {
                if (err) {
                    return res.send({
                        success: false,
                        message: 'خطا در به‌روز رسانی موجودی'
                    })
                }
            })
        }

    })

});

router.post('/done', (req, res) => {
    // TODO: push notification
    for (var i = 0; i < req.body.cart.length; i++) {
        var count = req.body.cart[i].count;
        Product.findOne({
            _id: req.body.cart[i]._id
        }).exec((err, result) => {
            if (err || !result) {
                res.send({
                    success: false,
                    message: ' کالا نامعتبر است'
                });
            }
            result.count -= count;
            result.save((err) => {
                if (err) {
                    res.send({
                        success: false,
                        message: "خطا در ذخیره‌سازی"
                    });
                }
            })
        })
    }

    var newTransaction = {
        owner: req.body.userID,
        cart: req.body.cart,
        tokenDiscount: number(req.body.tokenDiscount)
    }

    Transaction.create(newTransaction, (err, result) => {
        if (err) {
            res.send({
                message: 'خطا: تراکنش ثبت نشد',
                success: false,
            });
        } else {
            res.send({
                message: 'تراکنش با موفقیت ثبت شد',
                success: true
            });
        }
    });

    res.send({
        message: 'خرید با موفقیت انجام شد',
        success: true
    });

});

module.exports = router;