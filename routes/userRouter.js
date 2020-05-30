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

userRouter.route('/profile')
  .get(user.verifyUser,user.verifyPhone,(req, res, next) => {
    data = req.user.toJSON();
    delete data['password'];
    response.dataResponse(res,200,data,'Successfully listed the details of user');
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



module.exports = userRouter;
