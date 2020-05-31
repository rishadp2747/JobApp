var express = require('express');
var bodyParser = require('body-parser');

//service
const response = require('../serviceProviders/respondent');

//middlewares
var user = require('../middlewares/userMiddlewares');
var job  =  require('../middlewares/jobMiddlewares'); 

//model
var Job  =  require('../models/Jobs');

var jobsRouter = express.Router();
jobsRouter.use(bodyParser.json());

jobsRouter.route('/')
    .get( user.verifyUser, (req, res, next) => {
        //to get all the jobs in the pool
        Job.find({},'title description dateFrom dateTo timeFrom timeTo skill status ').populate({
            path : 'postedBy',
            match: {
                        location:
                            { $near :
                                {
                                $geometry: { type: "Point",  coordinates: req.user.location.coordinates },
                                $minDistance: 0000,
                                $maxDistance: 5000

                                }
                            }
                    },
            select: 'name phone email location'})
        .then( (job) => {
            response.dataResponse(res, 200, job, 'Successfully listed all jobs');
        }, (err) =>{
            response.errorResponse(res, 500, 'ServerError', 'Please contact administrator ! Error : JR100');
        })
    })
    .post( user.verifyUser, user.verifyPhone, (req, res, next) => {
        var job = new Job(req.body);
        job.postedBy = req.user._id;
        job.save((err) => {
            if(err){
                if(err.name == 'ValidationError'){
                    let count = Object.keys(err.errors).length
                    response.errorResponse(res, 400, count+err.name+' : '+Object.keys(err.errors), err.message);
                }else{
                    response.errorResponse(res, 400, err.name, err.message);
                }
            }else{
                response.dataResponse(res, 201, job, 'Successfully posted the job');
            }
        });
    });


jobsRouter.route('/request/:jobId')
    .get(user.verifyUser, job.verifyJob, job.verifyOwner, (req, res, next) => {
        //to display all the requests of a particular job
        Job.findOne({'_id' : req.params.jobId},'requests').populate('requests','name skill age sex phone email rating location')
            .then( (jobs) => {
                if(jobs){
                    response.dataResponse(res, 200, jobs, 'Successfully listed all requests for this job');
                }
            }, (err) =>{
                response.errorResponse(res, 500, 'ServerError', 'Please contact administrator ! Error : JR200')
            })
    })
    .put(user.verifyUser, user.verifyPhone, job.verifyJob, job.verifyStatusActivePending, job.verifySkill, (req, res, next) => {
        //to show the intrest in a job in a particular job.
        Job.findOne({'_id' : req.params.jobId}, (err, job) => {
            if(err){
                response.errorResponse(res, 500, 'ServerError', 'Please contact adminsitrator');
            }
            if(job){
                if(job.requests.includes(req.user._id)){
                    response.errorResponse(res, 400, 'ValidationError', 'You are already requested for this job');
                }else{
                    job.requests.push(req.user._id);
                    job.status = 'pending';
                    job.save( (err) => {
                        if(err){
                            response.errorResponse(res, 400, err.name, err.message);
                        }else{
                            response.dataResponse(res, 200, job, 'Successfully requested for this job');
                        }
                    });
                }
            }else{
                res.errorResponse(res, 400, 'JobError', 'No such job found');
            }
        })
    })
    .delete(user.verifyUser, job.verifyJob, job.verifyRequest, (req, res, next) => {
        //to remove a request from the job
        Job.findOneAndUpdate({'_id' : req.params.jobId, requests : req.user._id},{ $pullAll: {requests: [req.user._id] }},{'new' : true},(err, job) => {
            if(err){
                response.errorResponse(res, 500, 'ServerError', 'Please contact adminsitrator');
            }
            if(job){
                response.dataResponse(res, 200, job, 'Successfully removed your request');
            }else{
                response.errorResponse(res, 400, 'DeleteError', 'Failed to remove your request');
            }
        });
    });



jobsRouter.route('/commit/:userId')
    .put(user.verifyUser, job.verifyJob, job.verifyOwner, job.verifyRequest, (req, res, next) => {
        //select the user fo this job
        Job.findOneAndUpdate({'_id' : req.body.jobId}, {'commitedBy' : req.params.userId, 'status' : 'commit'}, {'new' : true }, (err, job) => {
            if(err){
                response.errorResponse(res, 500, 'ServerError', 'Please contact adminsitrator');
            }
            if(job){
                response.dataResponse(res, 200, job, 'Successfully commited the user for this job');
            }else{
                response.errorResponse(res, 400, 'UpdateError', 'Failed to commit the user for this job');
            }
        })
    });


jobsRouter.route('/complete')
    .put(user.verifyUser, job.verifyJob, job.verifyOwner, job.verifyCommit, (req, res, next) => {
        //change the status as completed
        Job.findOneAndUpdate({'_id' : req.body.jobId}, {'status' : 'completed'}, {'new' : true }, (err, job) => {
            if(err){
                response.errorResponse(res, 500, 'ServerError', 'Please contact adminsitrator');
            }
            if(job){
                response.dataResponse(res, 200, job, 'Successfully completed this job');
            }else{
                response.errorResponse(res, 400, 'UpdateError', 'Failed to complete this job');
            }
        })
    })
    //to get all completed Jobs of a User
    .get(user.verifyUser,user.verifyPhone,(req,res,next) => {
        Job.find({'commitedBy' : req.user._id, 'status' : 'completed'}, (err,job) => {
            if(err){
                response.errorResponse(res, 500, 'ServerError', 'Please contact adminsitrator');
            }
            if(job){
                response.dataResponse(res, 200, job, 'Successfully listed  all the jobs the user completed');
            }else{
                response.errorResponse(res, 400, 'ListError', 'Failed to list the jobs the user completed');
            }
        })
    });

jobsRouter.route('/:jobId')
    //To delete a Job
    .delete(user.verifyUser, job.verifyJob, job.verifyOwner, (req, res, next) => {
        Job.findByIdAndRemove({_id : req.params.jobId}, (err, job) => {
            if(err){
                response.errorResponse(res, 500, 'ServerError', 'Please contact adminsitrator');
            }
            if(job){
                response.dataResponse(res, 200, job, 'Successfully deleted the job')
            }else{
                response.errorResponse(res,400,err,'Failed to delete the job');
            }
        });
    })
    //To update a Job
    .put(user.verifyUser, user.verifyPhone, job.verifyJob, job.verifyOwner, (req, res, next) => {
        Job.findByIdAndUpdate({_id : req.params.jobId},req.body, (err,job) => {
            if(err) {
                response.errorResponse(res, 500, 'ServerError', 'Please contact adminsitrator');
            }
            if(job){
                response.dataResponse(res,200, job,'Successfully updated the job');
            }else{
                response.errorResponse(res,400,err,'Failed to update the job');
            }
           
        });
    });

jobsRouter.route('/myjob')
    .get(user.verifyUser, (req, res, next) => {
        Job.find( {'postedBy' : req.user._id },(err,job) => {
          if(err){
            response.errorResponse(res, 500, 'ServerError', 'Please contact adminsitrator');
          }
          if(job){
              response.dataResponse(res, 200, job, 'Successfully listed  jobs');
            }else{
                response.errorResponse(res, 400, 'UpdateError', 'Failed to list the jobs');
            }
        })
    })

//to get the details of a particular job
jobsRouter.route('/jobs/:jobId')
    .get(user.verifyUser,job.verifyJob,(req,res,next) => {
      Job.find( {'_id' : req.params.jobId},(err,job) => {
          if(err){
            response.errorResponse(res, 500, 'ServerError', 'Please contact adminsitrator');
          }
          if(job){
              response.dataResponse(res, 200, job, 'Successfully listed  the job details');
            }else{
                response.errorResponse(res, 400, 'ListError', 'Failed to list the job details');
            }
      })
    });

jobsRouter.route('/request')
    //to list all Jobs requested by a User
    .get(user.verifyUser,user.verifyPhone,(req,res,next) => {
        Job.find({requests : { $in: [req.user._id] }},(err,job) => {
            if(err){
                response.errorResponse(res, 500, 'ServerError', 'Please contact adminsitrator');
            }
            if(job){
                response.dataResponse(res, 200, job, 'Successfully listed  the job requets');
            }else{
                response.errorResponse(res, 400, 'ListError', 'Failed to list the job requests');
            }
        })
        
    });

jobsRouter.route('/commit')
//to get all Jobs a User got selected
.get(user.verifyUser,user.verifyPhone,(req,res,next) => {
    Job.find({'commitedBy' : req.user._id, 'status' : 'commit'}, (err,job) => {
        if(err){
            response.errorResponse(res, 500, 'ServerError', 'Please contact adminsitrator');
        }
        if(job){
            response.dataResponse(res, 200, job, 'Successfully listed  all the jobs the user got selected');
        }else{
            response.errorResponse(res, 400, 'ListError', 'Failed to list the jobs the user got selected');
        }
    })
});



module.exports = jobsRouter;
