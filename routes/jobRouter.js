var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var passport = require('passport');

const response = require('../serviceProviders/responser');


var user = require('../middlewares/user');
var job  =  require('../middlewares/verify'); 

var User = require('../models/Users');
var Job  =  require('../models/Jobs');

var jobsRouter = express.Router();
jobsRouter.use(bodyParser.json());

jobsRouter.route('/')
    .get( user.verifyUser, (req, res, next) => {
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
    .get(user.verifyUser, job.verifyJob, (req, res, next) => {
        Job.findOne({'_id' : req.params.jobId},'requests').populate('requests','name skill age sex phone email rating location')
            .then( (jobs) => {
                if(jobs){
                    response.dataResponse(res, 200, jobs, 'Successfully listed all requests for this job');
                }
            }, (err) =>{
                response.errorResponse(res, 500, 'ServerError', 'Please contact administrator ! Error : JR200')
            })
    })
    


module.exports = jobsRouter;