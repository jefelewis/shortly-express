var request = require('request');
var session = require('express-session');
var db = require('../app/config');
var User = require('../app/models/user');
var bcrypt = require('bcrypt-nodejs');

exports.getUrlTitle = function(url, cb) {
  request(url, function(err, res, html) {
    if (err) {
      console.log('Error reading url heading: ', err);
      return cb(err);
    } else {
      var tag = /<title>(.*)<\/title>/;
      var match = html.match(tag);
      var title = match ? match[1] : url;
      return cb(err, title);
    }
  });
};

var rValidUrl = /^(?!mailto:)(?:(?:https?|ftp):\/\/)?(?:\S+(?::\S*)?@)?(?:(?:(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[0-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))|localhost)(?::\d{2,5})?(?:\/[^\s]*)?$/i;

exports.isValidUrl = function(url) {
  return url.match(rValidUrl);
};

/************************************************************/
// Add additional utility functions below
/************************************************************/

// Check if User is logged in
exports.isLoggedIn = function(req, res, next) {
  if (!req.session || req.session.user === null) {
    res.redirect('/login');
  }
  next();
};


// Comparing User Hash
exports.compareHash = function(req, res, next) {
  new User(req.body.username).fetch().then(function (user) {
    bcrypt.compare(req.body.password, user.attributes.password, function(err, res){
      if (err) {
        console.log('login failed');
        res.redirect('/');
      }
      else{
        next(); 
      }
    });
  }).catch(function(err, res) {
    res.redirect('/signup');
  });
}