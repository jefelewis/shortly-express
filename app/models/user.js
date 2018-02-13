var db = require('../config');
var bcrypt = require('bcrypt-nodejs');
var Promise = require('bluebird');



var User = db.Model.extend({
    tableName: 'users',


    initialize: function() {
    //   this.on('creating', function(model, attrs, options) {
    //     var shasum = crypto.createHash('sha1');
    //     shasum.update(model.get('url'));
    //     model.set('code', shasum.digest('hex').slice(0, 5));
    //   });
    // }
      this.on('creating', function(model, attrs, options) {


        
        // Hash Password + Generate Salt Rounds
        bcrypt.genSalt(10, function(salt) {
          bcrypt.hash(model.get('password'), salt, null, function(err, hash){
            if(err) {
              console.log("The error exists at the init func")
              throw err;
            } else {
              model.set('password', hash);  
            }
          })
        })
      })
    }
});

module.exports = User;