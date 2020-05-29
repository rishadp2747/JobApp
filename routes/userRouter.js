var express = require('express');
const bodyParser = require('body-parser');

var User = require('../models/Users');
var passport = require('passport');

var authenticate = require('../middlewares/user');
var verify = require('../middlewares/verify');

var respondent = require('../serviceProviders/respondent');

var userRouter = express.Router();

userRouter.use(bodyParser.json());


userRouter.route('/register')
  .get( (req, res, next) => {
      res.statusCode  = 404;
      res.json({
        success : false,
        error : 'EndPointError',
        message : 'There is no such endpoint with these REST verb'
      });
  })
  .post( (req, res, next) => {
    passport.authenticate('userRegister', (err, user, info) => {
      if(err) {
        return next(err)
      }
  
      if(user) {
        delete user['password']
        const token = authenticate.getToken({_id: user._id});
        res.statusCode = 201;
        res.json({
          success : true,
          data  : user,
          message : "Successfully completed Registration"
        });
      }else{
        res.statusCode = 400;
        res.json({
          success : false,
          error     : 'ErrorFields or ValidationError',
          message : info
        });
      }
      })(req, res, next);

  });


  
userRouter.route("/login")
.post((req, res, next) =>  {
  passport.authenticate("userLogin", function(err, user, info) {
    if(err){
      return next(err);
    }
    if(user) {
      verify.verifyPhone(user._id)
        .then((result) => {
          if(result){
            const token = authenticate.getToken({_id: user._id});
            res.statusCode = 200;
            res.json({
              success : true,
              phoneVerify : true,
              data    : {
                "token" : token
              },
              message : "Logged in successfully"
            });
          }
        }, (err) => {
          if(err){
            const token = authenticate.getToken({_id: user._id});
            res.statusCode = 401;
            res.json({
              success : true,
              phoneVerify : false,
              data  : {
                "token" : token
              },
              error   : err.err,
              message : "Logged in successfully !"+err.info
            });
          }
        })
        .catch( (err) => {
          res.statusCode = 500;
          res.json ({
            success : false,
            error     : err.name,
            message : err.message
          })
        });
    }else if(!user){
      res.statusCode = 400;
      res.json({
        success : false,
        error     : 'Credential Error',
        message : info
      });
    }
  })(req, res, next);

});

userRouter.route('/profile')
.get(authenticate.verifyUser,authenticate.verifyPhone,(req, res, next) => {
  
  try {
  data = [req.user.location,req.user.skills,req.user.rating,req.user.phone,req.user.phoneVerify,req.user.email,req.user.age,
    req.user.name,req.user.sex,req.user.createdAt,req.user.updatedAt,req.user.__v];

    respondent.dataResponse(res,200,data,'Successfully fetched details of the user');
  }
  catch(err) {
    respondent.errorResponse(res,500,err,'failed to fetch details of user');
  }
});




module.exports = userRouter;
