var express = require('express')
var app = express();

var path = require('path');

var mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/marathon', {
  useNewUrlParser: true
})

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log('db connected!');
});

var morgan = require('morgan');
var ejs = require('ejs')

var session = require('express-session');
app.use(session({
  secret: 'qpay.ir',
  saveUninitialized: false,
  resave: true,
}));

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

app.use('*',(req,res,next) => {
    console.log(req.body);
    next();
});
var products = require('./routes/products');
app.use('/products', products);

var users = require('./routes/users');
app.use('/users', users);

var transaction = require('./routes/transactions');
app.use('/transactions', transaction);

var discountToken = require('./routes/discountTokens');
app.use('/discounts', discountToken);

var store = require('./routes/stores');
app.use('/stores',store);

var qGift = require('./routes/qGifts');
app.use('/qgifts',qGift);

app.use('/public', express.static(path.join(__dirname, '../public')));
app.use('/pay', express.static(path.join(__dirname, '../public/html/pay/')))


app.listen(8080, console.log('server connected: 8080'))