var express = require('express');
var router = express.Router();

var Store = require('./../model/store');

router.post('/',(req,res) => {
    Store.find((err,stores) => {
        if(err || !stores){
            return res.send({
                success : false,
                message : "خطا رد ارتباط"
            })
        }
        return res.send({
            success : true,
            message : "موفقیت",
            info : stores
        })
    });
});

router.post('/add',(req,res) => {
    var storeData = {
        name : req.body.name,
        location : req.body.location,
        deviceToken : req.body.deviceToken,
        address : req.body.address,
        picture : req.body.picture
    }

    Store.create(storeData, (err,store) => {
        if(err){
            console.log(err);
            return res.send({
                success : false,
                message: "خطا در ذخیره سازی"
            });
        }
        return res.send({
            success : true,
            message :"فروشگاه اضافه شد",
            info : store
        })
    }); 
});


module.exports = router;