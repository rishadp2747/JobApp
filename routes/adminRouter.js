var express = require('express');
const bodyParser = require('body-parser');

//middlewares
var admin = require('../middlewares/adminMiddlewares');
var auth = require('../middlewares/authMiddlewares');

//services
var response = require('../serviceProviders/respondent');

//model
const Admin = require('../models/Admins');

var adminRouter = express.Router();
adminRouter.use(bodyParser.json());


adminRouter.route('/register')
  .post(admin.adminRegister, (req, res, next) => {
    token = auth.getToken({_id : req.user._id, admin : true});
    response.dataResponse(res, 200, {token : token}, 'Successfully registered');
  });

adminRouter.route('/login')
  .post(admin.adminLogin, (req, res, next) => {
      token = auth.getToken({_id : req.user._id, admin : false});
      response.dataResponse(res, 200, {token : token}, 'Successfully loged in');
  });

module.exports = adminRouter;
