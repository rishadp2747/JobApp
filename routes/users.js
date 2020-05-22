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

router.put('/resend/email_otp', (req, res) => {
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

router.post('/email_otp/verify', (req, res, next) => {
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



router.post('/reset_password/email/otp',(req,res,next) => {
  verify.checkEmail(req.body.email)
    .then( (user) => {
      mailer.resetVerify(user.name, user.email)
      .then( (otp) => {
        user.resetVerify = {'verify' : false, 'OTP' : otp };
        return user;
      })
      .then((user) => {
        if(user){
          user.save( (err) => {
            if(err) {
              res.statusCode = 500;
              res.json({success : false, error : err, message : 'Failed to update user with OTP'});
            }else{
              res.statusCode = 200;
              res.json({success : true, message : 'OTP sended successfully'});
            }
          });
        }else return;
      })
      .catch( (err) => {
        res.statusCode = 500;
        res.json({success : false, error : err, message : 'Failed to send OTP to given email'});
      });
    })
    .catch( (err) => {
      res.statusCode = 500;
      res.json({success : false, error : "UserError", message : 'No such User found'});
    });
});

router.post('/reset_password/email/verify', (req, res, next) => {
  verify.checkEmail(req.body.email)
    .then( (user) => {
      otpTimeChecker.timeChecker(user.resetVerify.updatedAt)
        .then( () => {
          if(req.body.otp === user.resetVerify.OTP){
            user.resetVerify.verify = true;
            user.resetVerify.OTP = null;
            return user;
          }else{
            res.statusCode = 500;
            res.json({success : false, error : 'OTPFailed', message : 'Failed to verify the user'});
          }
        })
        .then( (user) => {
          if(user){
            user.save( (err) => {
              if(err) {
                res.statusCode = 500;
                res.json({success : false, error : err, message : 'Failed to update user with OTP'});
              }else{
                res.statusCode = 200;
                res.json({success : true, data: {userId :user._id }, message : 'OTP verified successfully'});
              }
            });
          }
        })
        .catch( (err) =>{
          res.statusCode = 500;
          res.json({success : false, error : 'OTPTimeError', message : 'Time out please resend the OTP'});
        });
    })
    .catch( (err) => {
      res.statusCode = 500;
      res.json({success : false, error : err, message : 'No such User found'});
    });
});


//to reset the password - can only reset password if the user verify to reset using email OTP
router.put('/reset_password/:userId', (req, res, next) => {
  verify.verifyReset(req.params.userId)
    .then( (user) => {
      if(req.body.password === req.body.confirm){
        user.password = req.body.password
        user.resetVerify.verify = false;
        user.resetVerify.OTP = null;
        return user;
      }else{
        res.statusCode = 500;
        res.json({success : false, error : 'MissMatchError', message : 'Password and confirmation password is not matching'});
      }
    })
    .then((user) => {
      if(user){
        user.save( (err) => {
          if(err) {
            res.statusCode = 500;
            res.json({success : false, error : err, message : 'Failed to update user with new password'});
          }else{
            res.statusCode = 200;
            res.json({success : true, message : 'Password resetted successfully'});
          }
        });
      }
    })
    .catch( (err) =>{
      res.statusCode = 500;
      res.json({success : false, error : 'ResetError', message : err});
    });
});






module.exports = router;


//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfX2lkIjoiNWVjNTcxZjJjZWUxMzMwNDkwNGUyNzIyIiwiaWF0IjoxNTg5OTk4MDY3LCJleHAiOjE1OTAwMDE2Njd9.nJwffqf8uIgDTNUVDV5jXDEZ341Gz0FDalF0isZgSRo