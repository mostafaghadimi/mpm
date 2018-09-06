var express = require('express')
var router = express.Router();

var bcrypt = require('bcrypt')

var User = require('./../model/user');

router.post('/registration', (req, res, next) => {
    //TODO: translate the messages and using JSON Web Token to create token :). change the current email and password
    var hash = bcrypt.hashSync(req.body.password, 10);
    var userData = {
        name: req.body.name,
        username: req.body.username,
        email: req.body.email,
        password: hash
    }

    User.create(userData, function (error, user) {
        if (error) { //when Email is already exists come here, Because in mongoose Model we defined email uniqueness equals to true
            res.send({
                success: false,
                message: error
            });
            return next(error);
        } else {
            req.session.userId = user._id;
            user.password = ''
            res.send({
                success: true,
                info: user
            });
            console.log(user);
        }
    });
});

router.post('/login', (req, res, next) => {

    if (req.body.email && req.body.password) {
        User.authenticate(req.body.email, req.body.password, function (error, user) {
            if (error) {
                console.log(error);
                res.send({
                    success: false,
                    message: error
                });
                return next(error);
            }
            if (!user) {
                var err = new Error('Wrong password.');
                err.status = 401;
                res.send({
                    success: false,
                    info: err
                });
                return next(err);
            }
            console.log(user);
            req.session.userId = user._id;
            req.session.loggedIn = true;
            user.password = ''
            res.send({
                success: true,
                info: user
            });
        });
    } else {
        var err = new Error('All fields required.');
        err.status = 400;
        return next(err);
    }
});


module.exports = router;