var express = require('express');
var router = express.Router();

var Product = require('../model/product');

router.post('/validation', (req, res) => {
    var flag = false;
    for (var i = 0; i < req.body.cart.length; i++){
        Product.findOne({_id: req.body.cart[i]._id}).exec((err, result) => {
            if (req.body.cart[i].count > result.count){
                flag = true;
                
            }
        })
        if (flag) {
            break;
        }
    }
    if (flag) {
        res.send({
            // TODO: return unavailable goods
            message: 'برخی از کالاها موجود نیستند',
            success: false
        })
    }
    else {
        res.send({
            message: 'سبد خرید تایید شد',
            success: true,
            information: req.body.cart
        })
    }
})


router.post('/done', (req, res) => {
    // substract from the count
    for (var i = 0; i < req.body.cart.length; i++){
        Product.findOne({_id: req.body.cart[i]._id}).exec((err, result) => {
                
                
            
        })
    }

})

module.exports = router;