var db = require('../config');
var bcrypt = require('bcrypt-nodejs');
var Promise = require('bluebird');



var User = db.Model.extend({
    tableName: 'users',


    initialize: function() {        
        // Hash Password + Generate Salt Rounds
        let that = this;
        bcrypt.genSalt(10, function(salt) {
          bcrypt.hash(that.get('password'), salt, null, function(err, hash){
            if(err) {
              console.log("The error exists at the init func")
              throw err;
            } else {
              that.set('password', hash);  
            }
          });
        });
    }
});

module.exports = User;