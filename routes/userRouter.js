var express = require('express');
const bodyParser = require('body-parser');

//middlewares
var user = require('../middlewares/userMiddlewares');

//services
var response = require('../serviceProviders/respondent');

//model
const User = require('../models/Users');

var userRouter = express.Router();
userRouter.use(bodyParser.json());


userRouter.route('/register')
  .post(user.userRegister, user.verifyPhone, (req, res, next) => {
    token = user.getToken({_id : req.user._id});
    response.dataResponse(res, 200, {token : token}, 'Successfully registered');
  });

userRouter.route('/login')
  .post(user.userLogin, user.verifyPhone, (req, res, next) => {
      token = user.getToken({_id : req.user._id});
      response.dataResponse(res, 200, {token : token}, 'Successfully loged in');
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
userRouter.route('/edit')
  .put(authenticate.verifyUser,authenticate.verifyPhone,(req,res,next) => {
    User.findByIdAndUpdate({_id:req.user._id},req.body,{new : true},(err,user) => {
      if(!err){
        console.log(user)
        respondent.dataResponse(res,200,user,"Successfully updated user")
      }
      else{
        respondent.errorResponse(res,500,err,"Error during updation")
      }
    });
  });

userRouter.route('/delete')
  .delete(user.verifyUser,user.verifyPhone,(req, res, next) => {
    User.findByIdAndRemove({_id : req.user._id},(err, user) => {
      if(err){
        response.errorResponse(res, 500, 'ServerError','Please contact administrator');
      }
      if(user){
        response.dataResponse(res, 200, user, 'Successfully deleted the user');
      }else{
        response.errorResponse(res, 400, err, 'Failed to delete this user');
      }
    });
  });

userRouter.route("/skill/add")
.put(user.verifyUser, user.verifyPhone,  (req, res, next) => {
                    req.user.skills.push(req.body.skills);
                    req.user.save( (err) => {
                        if(err){
                            response.errorResponse(res, 400, err.name, err.message);
                        }else{
                            response.dataResponse(res, 200, job, 'Successfully added the skill');
                        }
                    });
      });


module.exports = userRouter;
