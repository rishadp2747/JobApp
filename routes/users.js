var express = require('express');
const bodyParser = require('body-parser');

var mailer = require('../serviceProviders/mailer');
var otpTimeChecker = require('../serviceProviders/otpTimeChecker');


var User = require('../models/Users');
var passport = require('passport');
var authenticate = require('../middlewares/user');

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
      username  : req.body.username,
      name  :     req.body.name,
      age :       req.body.age,
      sex :       req.body.sex,
      location :  req.body.location,
      phone :     req.body.phone,
      email :     req.body.email
    }), req.body.password)
    .then((user) =>{
      //send verification otp to mail
      mailer.emailVerifier(req.body.name, req.body.email, (err, result) => {
        if(err){
          return next(err);
        }else{
          user.emailVerify = {verify : false, OTP : result}
          user.save( (err) => {
            if(err)
              return next(err);
          });
        }
      });
    })
    .then(() => {
      passport.authenticate('local')(req, res, () => {
        var token = authenticate.getToken({__id: req.user._id});
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({
          success: true, 
          token : token,
          status: 'Registration Successful!'
        });
      });
    })
    .catch( (err) => {
      console.log(err);
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.json({
        success : false, 
        error : err.name, 
        message : err.message
      });
    });
  } 
});

router.put('/resend/email_otp',authenticate.verifyUser, (req, res) => {
  User.findById(req.user._id)
  .then( (user) => {
    mailer.emailVerifier(user.name, user.email, (err, result) => {
      if(err){
        return next(err);
      }else{
        user.emailVerify = {verify : false, OTP : result}
        user.save( (err) => {
          if(err)
            return next(err);
          else {
            res.json({
              success: true, 
              status: 'OTP resended'
            });
          }
        });
      }
    });
  })
  .catch ((err) => {
    console.log(err);
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.json({
      success : false, 
      error : err.name, 
      message : err.message
    });
  });
 
});

router.post('/email_otp/verify', authenticate.verifyUser, (req, res, next) => {
  User.findById(req.user._id)
    .then( (user) => {
      otpTimeChecker.timeChecker(user.emailVerify.updatedAt)
        .then( () => {
          if(req.body.otp === user.emailVerify.OTP){
            user.emailVerify.verify = true;
            user.emailVerify.OTP = null;
            user.save( (err) => {
              if(err){
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.json({
                  success : false, 
                  error : 'UserUpdateError', 
                  message : 'Updating the verified email OTP failed'
                });
              }
              else{
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json({
                  success : true, 
                  error : 'OTP', 
                  message : 'Successfuly verified your Email'
                });
              }
            });
          }else{
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.json({
              success : false, 
              error : 'OTPFailed', 
              message : 'Invalid OTP send'
            });
          }
        })
        .catch( (err) => {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.json({
            success : false, 
            error : 'TimeError', 
            message : err
          });
        });
    })
    .catch( (err) => {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.json({
        success : false, 
        error : err.name, 
        message : err.message
      });
    });
});


router.post('/login', passport.authenticate('local'), (req, res) => {
  var token = authenticate.getToken({__id: req.user._id});
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.json({
    success : true, 
    data : {"token" : token}, 
    message : "Login Successfully"
  });
});






module.exports = router;


//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfX2lkIjoiNWVjNTcxZjJjZWUxMzMwNDkwNGUyNzIyIiwiaWF0IjoxNTg5OTk4MDY3LCJleHAiOjE1OTAwMDE2Njd9.nJwffqf8uIgDTNUVDV5jXDEZ341Gz0FDalF0isZgSRo