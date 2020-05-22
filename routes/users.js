var express = require('express');
const bodyParser = require('body-parser');

var mailer = require('../serviceProviders/mailer');
var otpTimeChecker = require('../serviceProviders/otpTimeChecker');


var User = require('../models/Users');
var passport = require('passport');

var authenticate = require('../middlewares/user');
var verify = require('../middlewares/verify');

var router = express.Router();

router.use(bodyParser.json());


router.post('/register', (req, res, next) => {
  if(!Number.isInteger(req.body.age)){
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.json({
      success : false, 
      error : "Field Error", 
      message : "Age field value is not a valid integer"
    });
  }else{
    User.register( new User({
      name  :     req.body.name,
      age :       req.body.age,
      sex :       req.body.sex,
      location :  req.body.location,
      phone :     req.body.phone,
      email :     req.body.email,
    }), req.body.password)
    .then((user) =>{
      //to send otp to phone phase2
      return user;
    })
    .then(() => {
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
    })
    .catch( (err) => {
      res.statusCode = 500;
      res.json({
        success : false, 
        error : err.name, 
        message : err.message
      });
    });
  } 
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
