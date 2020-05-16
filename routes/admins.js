var express = require('express');
var router = express.Router();
const bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({extended : false}))
router.use(bodyParser.json());


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
  res.status(200).json({
          success : true ,
          data : 'processed data' ,
          message : 'Got a post request from /admins/register , Request Successfully Completed'
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
