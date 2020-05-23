var express = require('express');
const bodyParser = require('body-parser');

var User = require('../models/Users');
var passport = require('passport');

var authenticate = require('../middlewares/user');
var verify = require('../middlewares/verify');
var validator = require('../middlewares/validator');

var router = express.Router();

router.use(bodyParser.json());

router.post('/register', (req, res, next) => {
  passport.authenticate('userRegister', (err, user, info) => {
    if(err) {
      console.log('34');
      return next(err)
    }

    if(user) {
      const token = authenticate.getToken({_id: user._id});
      res.statusCode = 201;
      res.json({
        success : true,
        data    : {
          "token" : token
        },
        message : "Successfully completed Registration"
      });
    }else{
      res.statusCode = 400;
      res.json({
        success : false,
        err     : 'ErrorFields or ValidationError',
        message : info
      });
    }
    })(req, res, next);
});

router.post("/login", function(req, res, next) {
  passport.authenticate("local", function(err, user, info) {
    if (err) {
      return next(err);
    }
    if (user) {
      const token = authenticate.getToken({_id: user._id});
      verify.verifyPhone(user.id)
        .then( (result) => {
          console.log(result);
          res.statusCode = 200;
          res.json ({
            success : true,
            data : {
              "token" : token,
              "phoneVerify" : result.status,
              "info"  : result.info
            },
            message : "Successfully logged in"
          });
        }, (err) => {
          console.log(err);
          res.statusCode = 200;
          res.json ({
            success : true,
            data : {
              "token" : token,
              "phoneVerify" : err.status,
              "info"  : err.info
            },
            message : "Successfully logged in"
          });
        });
    } else {
      res.statusCode = 401;
      res.json({
        success : false, 
        err : info.name, 
        message : info.message 
      });
    }
  })(req, res, next);

});




module.exports = router;
