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

router.post('/payment/ipg', (req, res) => {
    var finalPrice = req.body.finalPrice;
    var cart = req.body.cart;
    var userID = req.body.userID;
    var tokenDiscount = req.body.tokenDiscount;
    var date = req.body.date;
    res.render('ipg', {
        finalPrice: finalPrice,
        cart: cart,
        userID: userID,
        tokenDiscount,
        tokenDiscount,
        date: date
    });
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
            if (user.credit < finalPrice) {
                return res.send({
                    success: false,
                    message: "موجودی کمتر از مبلغ است"
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
                return res.send({
                    success: true,
                    message: "پرداخت با موفقیت",
                    info: user
                })
            })
        }

    })

});

router.post('/payment/done', (req, res) => {
    // TODO: push notification
    console.log(req.body);
    var cart = req.body.cart;
    console.log('sdls');
    console.log(cart);
    for (var i = 0; i < cart.length; i++) {
        var count = cart[i].count;
        Product.findOne({
            _id: cart[i]._id
        }).exec((err, result) => {
            if (err || !result) {
                return res.send({
                    success: false,
                    message: ' کالا نامعتبر است'
                });
            }
            result.count -= count;
            result.save((err) => {
                if (err) {
                    return res.send({
                        success: false,
                        message: "خطا در ذخیره‌سازی"
                    });
                }
            })
        })
    }
    var newTransaction = {
        owner: req.body.userID,
        cart: cart,
        date: req.body.date,
        tokenDiscount: Number(req.body.tokenDiscount)
    }
    console.log(newTransaction);

    Transaction.create(newTransaction, (err, result) => {
        if (err) {
            console.log('errrrr : ', err);
            return res.send({
                message: 'خطا: تراکنش ثبت نشد',
                success: false,
            });
        }
        return res.send({
            message: 'تراکنش با موفقیت ثبت شد',
            success: true
        });

    });

});

router.post('/history', (req, res) => {
    var userID = req.body.userID;
    Transaction.find({
        owner: userID
    }, (err, transactions) => {
        if (err) {
            return res.send({
                success: false,
                message: "مشکل در ارتباط"
            })
        }
        transactions = transactions.sort({
            "createdAt": -1
        });
        return res.send({
            success: true,
            message: "پیدا شد",
            info: transactions
        })
    });
})

module.exports = router;