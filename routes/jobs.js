var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var passport = require('passport');



var user = require('../middlewares/user');
var verify       =  require('../middlewares/verify'); 

var User = require('../models/Users');
var Job  =  require('../models/Jobs');



var router = express.Router();

router.use(bodyParser.json());




var jobsRouter = express.Router();

jobsRouter.use(bodyParser.json());



jobsRouter.route('/request')
    .post((req, res, next) => {
        passport.authenticate('jwt', { session: false }, (err, user) => {
            if(user){
                console.log('1');
                verify.verifyPhone(user._id)
                .then( (result) => {
                    console.log('2');
                    if(result.status) {
                        return verify.jobStatus(req.body.jobId);
                    }
                }, (err) => {
                    if(!err.status){
                        res.statusCode = 401;
                        res.json({
                            success : false,
                            error   :  err.err,
                            message     : err.info
                        });
                    }
                })
                .then( (job) => {
                    if(job){
                        console.log('45');
                        return Job.findOne({'_id' : req.body.jobId})
                    }
                }, (err) => {
                    if(!err.status){
                        res.statusCode = 400;
                        res.json({
                            success : false,
                            error   :  err.err,
                            message     : err.info
                        });
                    }
                })
                .then( (job) => {
                    if(job){
                        job.requests.push(user._id);
                        job.save( (err) => {
                            if(err){
                                res.statusCode = 500;
                                res.json({
                                    success : false,
                                    error : err.name,
                                    message :   err.message
                                });
                            }else{
                                res.statusCode = 200;
                                res.json({
                                    success : true,
                                    data    :  job,
                                    message : 'Requested Successfully'
                                });
                            }
                        });
                    }
                });
            }
            if(err){
                res.statusCode = 500;
                res.json({
                    success : false,
                    error   :   err.name,
                    message : err.message
                });
            }
            if(!user){
                res.statusCode = 401;
                res.json({
                    success : false,
                    error : 'TokenError',
                    message : 'Authorization failed'
                });
            }

        })(req, res, next);

       
    })



jobsRouter.route('/')
    .get(  (req, res, next) => {
        passport.authenticate('jwt', { session: false }, (err, user) => {
            if(user){
                User.findOne({'_id' : user._id})
                .then( (user) => {
                    userCoordinates = user.location.coordinates;
                    return Job.find({},'title description dateFrom dateTo timeFrom timeTo skill status ').populate({
                        path : 'postedBy',
                        match: { 
                                    location:
                                        { $near :
                                            {
                                            $geometry: { type: "Point",  coordinates: userCoordinates },
                                            $minDistance: 0000,
                                            $maxDistance: 5000

                                            }
                                        }
                                },
                        select: 'name phone email location'
                    });
                }, (err) => {
                    res.statusCode = 401;
                    res.json({
                        success : false,
                        error   :   err.name,
                        message : 'No such user found' 
                    });
                })
                .then( (job) => {
                    let filteredJobs = [];
                    job.forEach((value, index) =>{
                        if(value.postedBy != null){
                            filteredJobs.push(value);
                        }
                    });
                    res.statusCode = 200;
                    res.json({
                        success : true,
                        data    : filteredJobs,
                        message : "Successfully listed the jobs" 
                    });
                },(err) => {
                    res.statusCode = 500;
                    res.json({
                        success : false,
                        error   :   err.name,
                        message : 'Failed to fetch the jobs' 
                    });
                });

            }
            if(err){
                res.statusCode = 500;
                res.json({
                    success : false,
                    error   :   err.name,
                    message : err.message
                });
            }
            if(!user){
                res.statusCode = 401;
                res.json({
                    success : false,
                    error : 'TokenError',
                    message : 'Authorization failed'
                });
            }
        })(req, res, next);     
    })

    .post((req, res, next) => {
        passport.authenticate('jwt', {session : false}, (err, user) => {
            verify.verifyPhone(user._id)
            .then( (result) => {
                if(result){

                    var job = new Job(req.body);
                    job.save()
                        .then(() => {
                            res.statusCode = 201;
                            res.json({
                                success : true,
                                message :   "Successfully posted the job"
                            });
                        }, (err) => {
                            res.statusCode = 400;
                            res.json({
                                success :   false,
                                error   :   err.name,
                                message :   err.message 
                            });
                        });

                }
            }, (err) => {
                if(err){
                    res.statusCode = 401;
                    res.json({
                        success : false,
                        error   : err.err,
                        message :   err.info
                    })
                }
            });
        })(req, res, next);
    });


   

    


module.exports = jobsRouter;