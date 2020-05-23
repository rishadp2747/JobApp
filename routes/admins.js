var express = require('express');
var router = express.Router();
const bodyParser = require('body-parser');
router.use(bodyParser.json());

var Admin = require('../models/Admins');
var passport = require('passport');


var authenticate = require('../middlewares/admin');

/* GET Admins listing. */
router.get('/', function(req, res, next) {
    res.status(200).json({
            success : true ,
            data : 'processed data' ,
            message : 'Got a get request from /admins, Request Successfully Completed'
    });
});    

/*Get Admin details*/
router.get('/:adminId', function(req, res, next) {
  var id = req.params.adminId;
  res.status(200).json({
          success : true ,
          data : 'processed data' ,
          message : 'Got a get request from /admins/'+id+' , Request Successfully Completed'
  });
    
});

/*Admin signup*/
router.post('/register', function(req, res, next) {
  Admin.register(new Admin({
    username : req.body.username,
    name     : req.body.name,
    email    : req.body.email
  }), req.body.password)
  .then( (user) => {
    passport.authenticate('local')(req,res, () => {
      res.statusCode = 200;
      res.json({
        success : true, 
        id  : req.user._id,
        message: 'Registration Successful!'
      });
    });
  }, (err) => {
    res.statusCode = 400,
    res.json({
      success : false, 
      err : err,
      message: 'Registration failed!'
    });
  })
  .catch( (err) => {
    console.log(err);
    res.statusCode = 500,
    res.json({
      success : false, 
      message: err
    });
  });
});

/*Admin login*/
router.post('/login', function(req, res, next) {
  res.status(200).json({
          success : true ,
          data : 'processed data' ,
          message : 'Got a post request from /admins/login , Request Successfully Completed'
    });
  });

/*Update Admin*/
router.put('/:adminId', function(req, res, next) {
  var id = req.params.adminId;
  res.status(200).json({
          success : true ,
          data : 'processed data' ,
          message : 'Got a put request from /admins/'+id+' , Request Successfully Completed'
  });


});

/*Delete Admin*/
router.delete('/:adminId', function(req, res, next) {
  var id = req.params.adminId;
  res.status(200).json({
          success : true ,
          data : 'processed data' ,
          message : 'Got a delete request from /admins/'+id+' , Request Successfully Completed'
  });


});

module.exports = router;
