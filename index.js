'use strict';
var express = require('express');
var bodyparser = require('body-parser');
var mongoose = require('mongoose');
var cors = require('cors'); // Cross-Origin Resource Sharing (CORS) defnes a way in which a browser and server can interact to safely determine whether or not to allow a cross-origin request
var passport = require('passport');
var Strategy = require('passport-http-bearer').Strategy;
var crypto = require('crypto'),
  algorithm = 'aes-256-ctr', // We'll encrypt all passwords stored in the database with AES 256-bit encryption
  password = '2vdbhs4Gttb2';

var app = express();
app.use(cors({ credentials: true, origin: true }));
// We'll use a free MongoLab instance if it exists in our confg fle, or a local MongoDB database if not. 
mongoose.connect(process.env.MONGOLAB_URI ||
  'mongodb://localhost/memberapp/users');

var appToken = '1234567890';

passport.use(new Strategy(
  function (token, cb) {
    //console.log(token);
    if (token === appToken) {
      return cb(null, true);
    }
    return cb(null, false);
  })
);

// create database schema
var userSchema = new mongoose.Schema({
  id: String,
  username: String,
  password: String
});

// create database model for database 'users'
var searchDb = mongoose.model('users', userSchema);

// We'll accept user password as text, then encrypt it
function encrypt(text) {
  var cipher = crypto.createCipher(algorithm, password)
  var crypted = cipher.update(text, 'utf8', 'hex')
  crypted += cipher.final('hex');
  return crypted;
}
function decrypt(text) {
  var decipher = crypto.createDecipher(algorithm, password)
  var dec = decipher.update(text, 'hex', 'utf8')
  dec += decipher.final('utf8');
  return dec;
}

var routes = function (app) {
  app.use(bodyparser.json());

  app.get('/',
  function (req, res) {
    res.json(({"message":"The current version of this API is v1. Please access by sending a POST request to /v1/login."}));
  });

  app.get('/login',
    passport.authenticate('bearer', { session: false }),
    function (req, res) { // don't allow GET request for login
      res.json(({ "message": "GET is not allowed. Please POST request with username and password." }));
    });

  app.post('/login',
    passport.authenticate('bearer', { session: false }),
    function (req, res) {
      console.log(req.body);
      var username = req.body.username;
      var password = req.body.password;

      userDb.find({login: username, // check whether the encrypted version exists in our database. 
        password: encrypt(password)},
        {password:0}, // password should not be a part of the resulting result set by setting the feld to 0 or false
        function (err, data) {
        res.json(data);
      });
    });

}
var router = express.Router();
routes(router);
app.use('/v1', router); // The API will use /v1 as the route prefx
var port = 5000;
app.listen(process.env.PORT || port, function () {
  console.log('server listening on port ' + (process.env.PORT || port));
});
