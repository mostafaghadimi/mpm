var express = require('express');
var router = express.Router();

var multer = require('multer');
var upload = multer({
    dest: '../assets/uploads/productPicture'
});
var Product = require('./../model/product');

router.get('/:groceryStoreName', (req, res) => {
    var storeName = req.params.groceryStoreName;
    Product.find({
        groceryStore: storeName
    }).exec((err, result) => {
        if (err) {
            return res.send({
                success: false,
                message: 'فروشگاهی با این نام پیدا نشد'
            })
        } else {
            return res.send({
                success: true,
                information: result,
                message: "کالاهای فروشگاه:"
            })
        }
    })
});

router.post('/add', upload.single('image'), (req, res) => {
    // TODO: save the data on database using productSchema :)
    if (!req.body.discount || (req.body.discount == "")) {
        req.body.discount = 0;
    }
    var newProduct = Product({
        name: req.body.name,
        productionDate: req.body.productionDate,
        expirationDate: req.body.expirationDate,
        price: Number(req.body.price),
        discount: req.body.discount,
        producer: req.body.producer,
        groceryStore: req.body.groceryStore,
        productImage: req.file === undefined ? 'default' : req.file.filename,
        count: req.body.count
    });

    Product.create(newProduct, (err, addedInfo) => {
        if (err) {
            console.log(err);
            return res.send({
                success: false,
                message: "خطا در ذخیره سازی"
            })
        } else {
            addedInfo.productImage = addedInfo._id + '.png';
            return res.send({
                success: true,
                message: "اطلاعات کالای موردنظر با موفقیت ثبت شد.",
                information: addedInfo
            })
        }
    })
});

router.post('/remove', (req, res) => {
    var productId = req.body.id;
    Product.findByIdAndRemove(productId, (err, product) => {
        if (err || !product) {
            res.send({
                success: false,
                message: "کالا ی نامعتبر"
            });
        }
        return res.send({
            success: true,
            message: "کالا با موفقیت حذف گردید",
            info: product
        });
    });
});

router.post('/refill', (req, res) => {
    var productId = req.body.id;
    var amount = req.body.amount;
    Product.findOne({
        _id: productId
    }, (err, product) => {
        if (err || !product) {
            return res.send({
                success: false,
                message: "کالا ی نامعتبر"
            });
        }
        product.count += amount;
        product.save(function (err) {
            if (err) {
                return res.send({
                    success: false,
                    message: "خطا در ذخیره سازی"
                });
            }
            return res.send({
                success: true,
                message: "عملیات موفق",
                info: product
            });
        });
    });
});

router.post('/changeDiscount', (req, res) => {
    var productId = req.body.id;
    var discount = req.body.discount;
    Product.findOne({
        _id: productId
    }, (err, product) => {
        if (err || !product) {
            return res.send({
                success: false,
                message: "کالا ی نامعتبر"
            });
        }
        product.discount = discount;
        product.save(function (err) {
            if (err) {
                return res.send({
                    success: false,
                    message: "خطا در ذخیره سازی"
                });
            }
            return res.send({
                success: true,
                message: "عملیات موفق",
                info: product
            });
        });
    });
});

module.exports = router;