var User = require('../models/Users');
var Job =   require('../models/Jobs');

var response = require('../serviceProviders/responser');

function getJobId(req){
    var jobId;
    if(req.params){
        if(req.params.jobId){
            jobId = req.params.jobId;
        }
    }
    if(req.body){
        if(req.body.jobId){
            jobId = req.body.jobId;
        }
    }
    return jobId;
}


function getUserId(req){
    var userId;
    if(req.params){
         if(req.params.userId){
            userId = req.params.userId;
        }
    }
    if(req.body){
        if(req.body.userId){
            userId = req.body.userId;
        }
    }
    if(req.user){
        if(req.user._id){
            userId = req.user._id;
        }
    }
    
    return userId;
}


exports.verifyJob = (req, res, next) => {
    var jobId = getJobId(req);
    Job.findOne({'_id' : jobId}, (err, job) => {
        if(err){
            response.errorResponse(res, 400, 'RequestError', 'Failed to read the data provided by user');
        }
        if(job){
            return next();
        }else{
            response.errorResponse(res, 400, 'ValidationError', 'No such job found')
        }
    }); 
};


exports.verifyOwner = (req, res, next) => {
    var jobId;
    if(req.params){
        if(req.params.jobId){
            jobId = req.params.jobId;
        }
    }
    if(req.body){
        if(req.body.jobId){
            jobId = req.body.jobId;
        }
    }
    Job.findOne({'_id' : jobId, 'postedBy' : req.user._id}, (err, job) => {
        if(err){
            response.errorResponse(res, 400, 'RequestError', 'Failed to read the data provided by user');
        }
        if(job){
            return next();
        }else{
            response.errorResponse(res, 401, 'ValidationError', 'You are not the owner of this job')
        }
    }); 
};


exports.verifyRequest = (req, res, next) =>{
    var jobId = getJobId(req);
    var userId = getUserId(req);

    Job.findOne({'_id' : jobId, 'requests' : userId }, (err, job) => {
        if(err){
            response.errorResponse(res, 400, 'RequestError', 'Failed to read the data provided by user');
        }
        if(job){
            return next();
        }else{
            response.errorResponse(res, 401, 'ValidationError', 'User not requested yet for this job or just cancelled the request')
        }
    });

};


exports.verifyStatusActivePending = (req, res, next) => {
    var jobId = getJobId(req);
    Job.findOne({'_id' : jobId, 'status' : { "$in" : ["active", "pending"] } } , (err,job) => {
        if(err){
            response.errorResponse(res, 400, 'RequestError', 'Failed to read the data provided by user'); 
        }

        if(job){
            return next();
        }else{
            response.errorResponse(res, 400, 'ValidationError', 'Failed to request for this job, current status of this job is above request status');
        }
    });
}


exports.verifySkill = (req, res, next) =>   {
    var jobId = getJobId(req);
    var userId = req.user._id;

    Job.findOne({'_id' : jobId},'skill', (err, job) => {
        if(err){
            response.errorResponse(res, 500, 'ServerError', 'Please contact administrator');
        }
        if(job){
            User.findOne({'_id' : userId, 'skills' : job.skill}, (err, user) => {
                if(err){
                    response.errorResponse(res, 500, 'ServerError', 'Please contact administrator');
                }
                if(user){
                    return next();
                }else{
                    response.errorResponse(res, 400, 'ValidationError', 'You are not eligible for this job');
                }
            })
        }else{
            response.errorResponse(res, 400, 'JobError', 'No such job found');
        }
    });
}

