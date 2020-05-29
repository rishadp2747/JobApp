var express = require('express');
const bodyParser = require('body-parser');

//middlewares
var user = require('../middlewares/userMiddlewares');

//services
var response = require('../serviceProviders/respondent');

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

module.exports = userRouter;
