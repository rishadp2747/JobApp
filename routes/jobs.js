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


jobsRouter.route('/commit/:userId')
    .put((req, res, next) => {
        passport.authenticate('jwt', {session : false}, (err, user) => {
            if(user){
                verify.jobOwner(req.body.jobId, user._id)
                    .then( (job) =>{
                        if(job){
                            return verify.verifyRequest(req.body.jobId, req.params.userId)
                        }
                    }, (err) =>{
                        if(err) {
                            res.statusCode = 401;
                            res.json({
                                success : false,
                                err :      err.err,
                                message : err.info
                            });
                        }
                    })
                    .then( (job) => {
                        if(job){
                            return Job.updateOne({'_id' : req.body.jobId}, {'commitedBy' : req.params.userId})
                        }
                    }, (err) => {
                        if(err){
                            res.statusCode = 500,
                            res.json({
                                success : false,
                                err : err.name,
                                message :   err.message 
                            });
                        }
                    })
                    .then((result) =>{
                        if(result.nModified == 1){
                            res.statusCode = 200,
                            res.json({
                                success : true,
                                message  : 'Successfully selected the user for this job'
                            });
                            
                        }
                    })

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

jobsRouter.route('/request/:jobId')
    .get((req, res, next) => {
        passport.authenticate('jwt', {session : false}, (err, user) => {
            if(user){
                verify.jobOwner(req.params.jobId, user._id)
                    .then((result) => {
                        if(result){
                            return Job.findOne({'_id' : req.params.jobId},'requests').populate('requests','name skill age sex phone email rating location')
                        }
                    }, (err) => {
                        res.statusCode = 401;
                        res.json({
                            success : false,
                            error : err.err,
                            message : err.info
                        });
                    })
                    .then((job) => {
                        if(job){
                            res.statusCode = 200;
                            res.json({
                                success : true, 
                                data    : job,
                                message :   'Successfully listed the requested users'
                            });
                        }
                    }, (err) => {
                        if(err){
                            res.statusCode = 500;
                            res.json({
                                success : false,
                                error : err.name,
                                message : err.message,
                            })
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
    .put((req, res, next) => {
        passport.authenticate('jwt', { session: false }, (err, user) => {
            if(user){
                verify.verifyPhone(user._id)
                .then( (result) => {
                    if(result.status) {
                        return verify.jobStatus(req.params.jobId);
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
                .then( (job) =>{
                    if(job){
                        return verify.verifySkill(req.params.jobId, user._id);
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
                        return Job.findOne({'_id' : req.params.jobId})
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
                                if(err.name === "ValidationError"){
                                    res.statusCode = 400;
                                    res.json({
                                        success : false,
                                        error : err.name,
                                        message :  'You already requested for this job'
                                    });  
                                }else{
                                    res.statusCode = 500;
                                    res.json({
                                        success : false,
                                        error : err.name,
                                        message :   err.message
                                    });

                                }
                                

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
    .delete( (req, res, next) => {
        passport.authenticate('jwt', { session: false }, (err, user) => {
            if(user){
                Job.updateOne({'_id' : req.params.jobId, requests : user._id},{ $pullAll: {requests: [user._id] }})
                    .then( (job) => {
                        if(job.nModified == 1){
                            res.statusCode = 200;
                            res.json({
                                success : false,
                                message : 'Successfully removed your request for this job'
                            });
                        }else{
                            res.statusCode = 400;
                            res.json({
                                success : false,
                                error   : 'ValidationError',
                                message : 'You are not requested for this Job or already deleted your request'
                            });
                        }
                    }, (err) =>{
                        if(err){
                            res.statusCode = 400;
                            res.json({
                                success : false,
                                error   : err.name,
                                message : err.message
                            });
                        }                             
                    })
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
                    job.postedBy = user._id;
                    job.save()
                        .then(() => {
                            res.statusCode = 201;
                            res.json({
                                success : true,
                                data    :   job,
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