var express = require('express');
var router = express.Router();
const bodyParser = require('body-parser');
//const bcrypt = require('bcrypt');
//const jwt = require('jsonwebtoken');

router.use(bodyParser.urlencoded({extended : false}))
router.use(bodyParser.json());

//const Admin = require("../models/Admin");  //Get Admins Model

/* GET Admins listing. */
router.get('/', function(req, res, next) {
    res.status(200).json({
      message : "Got a get request for /admins"
    });
    /*Admin.find({})
    .then(function (admins) {
        res.status(200).json({
            success : true ,
            data : users ,
            message : 'Request Successfully Completed'
            });
        })
    .catch(err => {
        return res.status(401).json({
            success : false,
            error : err,
            message : 'Failed to fetch Admins from the DB'
        });
    });*/   
});

/*Get Admin details*/
router.get('/:adminId', function(req, res, next) {
  var id = req.params.adminId;
  res.status(200).json({
    message : 'Got a get request for /admins/'+id
  });
    /*Admin.findById({_id : req.params.adminId})
    .exec()
    .then(function (admin_details){
        res.status(200).json({
            success : true ,
            data : admin_details[0] ,
            message : 'Request Successfully Completed'
            });
    })
    .catch(err => {
        return res.status(401).json({
            success : false,
            error : err,
            message : 'Failed to fetch Admins from the DB'
        });
    });*/
    
});

/*Admin signup*/
router.post('/register', function(req, res, next) {
  res.status(200).json({
    message : "Got a put request for /admins/register"
  });
    /*Admin.find({username : req.body.username})
    .exec()
    .then(admin => {
      if(admin.length >=1 ) {
        return res.status(409).json({
            success : false,
            error : 'Error 409',
            message : 'Username alreasy Exists. Try '
        });
      }
      else {
        bcrypt.hash(req.body.password,10,(err,hash) => {
          if(err){
            return res.status(500).json({
                success : false,
                error : 'Error 500',
                message : 'Something went wrong. Currently unable to handle this request'
            });
          }
          else {
            const admin = new Admin({
              _id : new mongoose.Types.ObjectId(),
              username : req.body.username,
              password : hash,
              name : req.body.name,
              email : req.body.email,
              //created_at : ,
              //updated_at : 
              });
            admin.save()
            .then(result =>{
                res.status(200).json({
                    success : true ,
                    data : result,
                    message : 'Registration successfull'
                    });
            })
            .catch(err => {
                return res.status(401).json({
                    success : false,
                    error : err,
                    message : 'Registration Failed'
                });
            });  
          }
        });
      }
    })
    .catch(err => {
        return res.status(401).json({
            success : false,
            error : err,
            message : 'Registration Failed'
        });
    });*/
});

/*Admin login*/
router.post('/login', function(req, res, next) {
  res.status(200).json({
    message : "Got a post request for /admins/login"
  });
    /*Admin.find({username : req.body.username})
    .exec()
    .then(admin => {
      if(admin.length < 1){
        return res.status(404).json({
            success : false,
            error : 'Error 404, username not found',
            message : 'Authentication Failed'
        });
      }
      bcrypt.compare(req.body.password,admin[0].password,(err, result) => {
        if(err){
          return res.status(401).json({
            success : false,
            error : err,
            message : 'Authentication Failed'
          });
        }
        if(result){
          const token = jwt.sign({
            username : user[0].username,
            adminId : user[0]._id  
            },
            'JWT_S3c3rtK3y',    // use any JWT secret key
            {
              expiresIn : "1h"
            })
          return res.status(200).json({
            success : true ,
            data : token,
            message : 'Authentication Successful'
          });
        }
        else {
          return res.status(401).json({
            success : false,
            error : 'Error 401',
            message : 'Authentication Failed'
          });
        }
      });

    })
    .catch(err => {
      return res.status(500).json({
        success : false,
        error : err,
        message : 'Authentication Failed'
      });
    });*/
  });

/*Update Admin*/
router.put('/:adminId', function(req, res, next) {
  var id = req.params.adminId;
  res.status(200).json({
    message : "Got a put request for /admins/"+id
  });
    /*var id = {_id : req.params.adminId};
    Admin.update(id, req.body)
     .then(function(doc) {
         res.status(200).json({
             success : true, 
             message : "Admin details Updated Successfully"
        });
     })
     .catch((err) => 
         res.json({
             success : false, 
            data : err, 
            message : "Admin details Updation Failed"
        })
    );*/


});

/*Delete Admin*/
router.delete('/:adminId', function(req, res, next) {
  var id = req.params.adminId;
  res.status(200).json({
    message : "Got a delete request for /admins/"+id
  });
    /*Admin.findByIdAndDelete(req.params.adminId)
     .then(function(doc) {
         res.json({
             success : true, 
             message : "Admin Successfully Deleted"
            });
     })
     .catch((err) => 
         res.json({
             success : false, 
             data : err, 
             message : "Admin Deletion Failed"
            })
     	);*/


});

module.exports = router;
