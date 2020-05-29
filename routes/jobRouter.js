var express = require('express');
var bodyParser = require('body-parser');

const response = require('../serviceProviders/respondent');

var user = require('../middlewares/user');
var job  =  require('../middlewares/jobMiddlewares');

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
    })


jobsRouter.route('/complete')
    .put(user.verifyUser, job.verifyJob, job.verifyOwner, job.verifyCommit, (req, res, next) => {
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

jobsRouter.route('/myjob')
    .get(user.verifyUser, (req, res, next) => {
      .then( (job) => {
          response.dataResponse(res, 200, job, 'Successfully listed all jobs');
      }, (err) =>{
          response.errorResponse(res, 500, 'ServerError', 'Please contact administrator ! Error : JR100');
      })
    })

module.exports = jobsRouter;
