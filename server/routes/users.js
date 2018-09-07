var express = require('express')
var router = express.Router();

var bcrypt = require('bcrypt')

var User = require('./../model/user');

router.post('/registration', (req, res, next) => {
    //TODO: translate the messages and using JSON Web Token to create token :). change the current email and password
    var hash = bcrypt.hashSync(req.body.password, 10);
    var userData = {
        name: req.body.name,
        email: req.body.email,
        password: hash
    }

    User.create(userData, function (error, user) {
        if (error) { //when Email is already exists come here, Because in mongoose Model we defined email uniqueness equals to true
            return res.send({
                success: false,
                message: error
            });
        } else {
            req.session.userId = user._id;
            user.password = ''
            console.log(user);
            return res.send({
                success: true,
                info: user
            });
        }
    });
});

router.post('/login', (req, res, next) => {

    if (req.body.email && req.body.password) {
        User.authenticate(req.body.email, req.body.password, function (error, user) {
            if (error) {
                console.log(error);
                return res.send({
                    success: false,
                    message: error
                });
            }
            if (!user) {
                var err = new Error('Wrong password.');
                err.status = 401;
                return res.send({
                    success: false,
                    info: err
                });
            }
            console.log(user);
            req.session.userId = user._id;
            req.session.loggedIn = true;
            user.password = ''
            return res.send({
                success: true,
                info: user
            });
        });
    }
});

router.post('/charge', (req, res) => {
    var credit = req.body.credit;
    var userID = req.body.userID;

    User.find({_id: userID}, (err, user) => {
        if (err || !user) {
            return res.send({
                success: false,
                message: 'کاربر نامعتبر'
            })
        }
        user.credit += credit;
        user.save(err => {
            if (err) {
                return res.send({
                    success: false,
                    message: 'خطای ذخیره‌سازی'
                })
            }
            return res.send({
                success: true,
                message: "موجودی با موفقیت افزایش یافت",
                information: user
            })
        })
    })
})


module.exports = router;