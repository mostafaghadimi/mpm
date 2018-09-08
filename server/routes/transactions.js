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
    var cart = req.body.cart;
    console.log(cart);
    User.findOne({
        _id: userID
    }, (err, user) => {
        if (err || !user) {
            return res.send({
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
            var isValid = true;

            for (var i = 0; i < cart.length; i++) {
                var count = cart[i].count;
                Product.findOne({_id: cart[i]._id},(err, product) => {
                    if (err || !product) {
                        isValid = false;
                    }
                    
                    // product.count -= count;
                    // product.save((err) => {
                    //     if (err) {
                    //         return res.send({
                    //             success: false,
                    //             message: "خطا در ذخیره‌سازی"
                    //         });
                    //     }
                    // })
                })
            }
            if (!isValid){
                return res.send({
                    success: false,
                    message: " سبد خرید نامعتبر است"
                });
            }
            var newTransaction = {
                owner: req.body.userID,
                cart: cart,
                date: req.body.date,
                price : finalPrice
            }
            console.log(newTransaction);
        
            Transaction.create(newTransaction, (err, transaction) => {
                if (err) {
                    return res.send({
                        message: 'خطا: تراکنش ثبت نشد',
                        success: false,
                    });
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
                        message: 'تراکنش با موفقیت ثبت شد',
                        success: true,
                        info : transaction._id
                    });
                })
        
            });
        }
    })
});


router.post('/history', (req, res) => {
    var userID = req.body.userID;
    Transaction.find({
        owner: userID
    }, (err, transactions) => {
        if (err) {
            console.log(err)
            return res.send({
                success: false,
                message: "مشکل در ارتباط"
            })
        }
        transactions = transactions.sort({
            "createdAt": -1
       });

        var respond = {
            success: true,
            message: "پیدا شد",
            info: transactions
        }
        console.log(respond);
        return res.json(respond);
    });
})

module.exports = router;