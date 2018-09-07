var express = require('express');
var router = express.Router();

var Store = require('./../model/store');

router.post('/add',(req,res) => {
    var storeData = {
        name : req.body.name,
        location : req.body.location,
        deviceToken : req.body.deviceToken
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