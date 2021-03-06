var express = require('express');
const bodyParser = require('body-parser');

//middlewares
var user = require('../middlewares/userMiddlewares');
var auth = require('../middlewares/authMiddlewares');

//services
var response = require('../serviceProviders/respondent');

//model
const User = require('../models/Users');

var userRouter = express.Router();
userRouter.use(bodyParser.json());


userRouter.route('/register')
  .post(user.userRegister, user.verifyPhone, (req, res, next) => {
    token = auth.getToken({_id : req.user._id, admin : false});
    response.dataResponse(res, 200, {token : token}, 'Successfully registered');
  });

userRouter.route('/login')
  .post(user.userLogin, user.verifyPhone, (req, res, next) => {
      token = auth.getToken({_id : req.user._id, admin : false});
      response.dataResponse(res, 200, {token : token}, 'Successfully loged in');
  });

userRouter.route('/profile')
  .get(auth.verifyUser,user.verifyPhone,(req, res, next) => {
    data = req.user.toJSON();
    delete data['password'];
    response.dataResponse(res,200,data,'Successfully listed the details of user');
  });

userRouter.route('/edit')
  .put(auth.verifyUser,user.verifyPhone,(req,res,next) => {
    User.findByIdAndUpdate({_id:req.user._id},req.body,{new : true},(err,user) => {
      if(!err){
        response.dataResponse(res,200,user,"Successfully updated user")
      }
      else{
        response.errorResponse(res,500,err,"Error during updation")
      }
    });
  });

userRouter.route('/delete')
  .delete(auth.verifyUser,user.verifyPhone,(req, res, next) => {
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
.put(auth.verifyUser, user.verifyPhone,  (req, res, next) => {
    req.user.skills.push(req.body.skills);
    req.user.save( (err) => {
        if(err){
            response.errorResponse(res, 400, err.name, err.message);
        }else{
            response.dataResponse(res, 200, req.user, 'Successfully added the skill');
        }
    });
});

// to delete a skill for a user
userRouter.route('/skill/remove')
.delete(auth.verifyUser,(req,res,next) => {
  req.user.skills.pop(req.body.skills);
  req.user.save( (err) => {
    if(err){
      response.errorResponse(res,400,err.name, err.message);
    }else {
      response.dataResponse(res, 200 ,job , ' Successfully  removed the skill');
    }
  });
});

userRouter.route('/delete')
  .delete(auth.verifyUser,user.verifyPhone,(req, res, next) => {
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
