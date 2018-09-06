var express = require('express');
var router = express.Router();

var multer = require('multer');
var upload = multer({dest: '../assets/uploads/productPicture'});

router.get('/:groceryStoreName', (req, res) => {
    var storeName = req.params.groceryStoreName;
    Product.find({groceryStore: storeName}).exec((err, result) => {
        if (err) {
            res.send({
                success: false,
                message: 'فروشگاهی با این نام پیدا نشد'
            })
        }
        else {
            res.send({
                success: true,
                information: result,
                message: "کالاهای فروشگاه:"
            })
        }
    })
});

router.post('/add', upload.single('image'), (req, res) => {
    // TODO: save the data on database using productSchema :)
    if (!req.body.discount || (req.body.discount == "") ){
        req.body.discount = 0;
    }
    var newProduct = Product({
        name: req.body.name,
        productionDate: req.body.productionDate,
        expirationDate: req.body.expirationDate,
        price: number(req.body.price),
        discount: req.body.discount,
        producer: req.body.producer,
        groceryStore: req.body.groceryStore,
        productImage: req.file === undefined ? 'default': req.file.filename
    });

    Product.create(newProduct, (err, addedInfo) => {
        if (err) {
            console.log(err)
        }
        else {
            res.send({
                success: true,
                message: "اطلاعات کالای موردنظر با موفقیت ثبت شد.",
                information: addedInfo
            })
        }
    } )
});

router.post('/remove', (req, res) => {

});

router.post('/refill', (req, res) => {

});

router.post('/changeDiscount', (req, res) => {

});

module.exports = router;