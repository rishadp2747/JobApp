var express = require('express');
var router = express.Router();
var jobs = require('../models/jobs');
var bodyParser = require('body-parser');

/* for /jobs */
router
/* To list all the jobs present in the server */
.get('/', function(req, res, next) {
 jobs.find()
     .then(function(doc) {
         res.json({success : true, data : doc, message : "Jobs listed Successfully"});
     })
     .catch((err) => 
         res.json({success : false, data : err, message : "Jobs listing Failed"})
     	);
})

/* To list the data of a particular job using its id */
.get('/:jobId', function(req, res, next) {
 jobs.findById(req.params.jobId)
     .then(function(doc) {
         res.json({success : true, data : doc, message : "Jobs listed Successfully"});
     })
     .catch((err) => 
         res.json({success : false, data : err, message : "Jobs listing Failed"})
     	);
})

/* To add new job to the DB */
.post('/', function(req, res, next) {
        var item = req.body;
  var data = new jobs(item);
  data.save()
      .then(()=> res.json({success : true, message : "Job Successfully added"}))
      .catch((err) => 
         res.json({success : false, data : err, message : "Job Adding Failed"})
     	);
})

/* To update the data of a particular job using its id */
.put('/:jobId', function(req, res, next) {
	var id = {_id : req.params.jobId};
 jobs.findByIdAndUpdate(id, req.body)
     .then(function(doc) {
         res.json({success : true, message : "Job Updated Successfully"});
     })
     .catch((err) => 
         res.json({success : false, data : err, message : "Job Updation Failed"})
     	);
})

/* To delete a particular job using its id */
.delete('/:jobId', function(req, res, next) {
 jobs.findByIdAndDelete(req.params.jobId)
     .then(function(doc) {
         res.json({success : true, message : "Job Successfully Deleted"});
     })
     .catch((err) => 
         res.json({success : false, data : err, message : "Job Deletion Failed"})
     	);
});

module.exports = router;