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

var products = require('./routes/products');
app.use('/product', products);

var users = require('./routes/users');
app.use('/user', users);

var transaction = require('./routes/transactions');
app.use('/transaction', transaction);

app.use('/public', express.static(path.join(__dirname, '../public')));
app.use('/pay', express.static(path.join(__dirname, '../public/html/pay/')))

app.get('/payment', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/html/ipg.html'))
})

app.listen(8080, console.log('server connected: 8080'))