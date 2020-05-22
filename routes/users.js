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

  validator.passwordValidator(req.body.password)
    .then( (result) => {
      if(result){
        User.register( new User({
          name  :     req.body.name,
          age :       req.body.age,
          sex :       req.body.sex,
          location :  req.body.location,
          phone :     req.body.phone,
          email :     req.body.email,
        }), req.body.password)
        .then( (user) => {
          console.log('33434');
          return verify.verifyPhone(user._id)
        }, (err) => {
          if(err.errors){
            if(err.errors.email){
              res.statusCode = 400;
              res.json({
                success : false, 
                error : err.errors.email.name, 
                message : err.errors.email.message
              });
            }
          }else{
            res.statusCode = 400;
            res.json({
              success : false, 
              error : err.name, 
              message : err.message
            });
          }
        })
        .then( (result) => {
          if(result){
            passport.authenticate('local')(req, res, () => {
              var token = authenticate.getToken({__id: req.user._id});
              res.statusCode = 200;
              res.json({
                success: true,
                data : {
                  "token" : token,
                }, 
                status: 'Registration Successful!'
              });
            });
          }
        });

        
      }
    }, (err) => {
      console.log('er'+ err);
      res.statusCode = 400;
      res.json({
        success : false, 
        error : err.err, 
        message : err.info
      });
    })
    .catch((err) => {
      console.log('434');
      console.log(err);

    });
    
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
