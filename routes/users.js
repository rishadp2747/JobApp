var express = require('express');
const bodyParser = require('body-parser');
var otpGenerator = require('otp-generator');



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
      username: req.body.username,
      name  : req.body.name,
      age : req.body.age,
      sex : req.body.sex,
      location : req.body.location,
      phone : req.body.phone
    }), req.body.password, (err, user) =>{
    if(err) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.json({
        success : false, 
        error : err.name, 
        message : err.message
      });
    }
    else {
      if(req.body.email){
        user.email = req.body.email;
      }
      if(req.body.skills){
        user.skills = req.body.skills;
      }
      user.save((err) => {
        if(err){
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.json({
            success : false, 
            error : err.name, 
            message : err.message
          });
        }
      });
      passport.authenticate('local')(req,res, () => {



        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({
          success : true, 
          message : "Registration Successfully Completed"
        });
      });
    }

  });
  }
  
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
