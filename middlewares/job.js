var user = require('../models/Users');
var Job =   require('../models/Jobs');

var response = require('../serviceProviders/responser');


exports.verifyJob = (req, res, next) =>{
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

exports.jobOwner = (req, res, next) => {
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

exports.verifySkill = (jobId, userId) => {
    return new Promise( (resolve, reject) => {
        Job.findOne({'_id' : jobId},'skill', (err, job) =>{
            if(job){
                user.findOne({'_id' : userId, 'skills' : job.skill}, (err, user) => {
                    if(err){
                        return reject({status : false , err : 'UserError', info : 'No such user found'});
                    }
                    if(user){
                        return resolve({status : true, data : user, info : 'User eligible for job'});
                    }else{
                        return reject({status : false , err : 'ElegibilityError', info : 'User not eligible for this job'});
                    }
                    
                });
                

            }
            if(err){
                return resolve({status : false, err : 'JobError' , info : 'No such job found'});
            }
        });
    });
};


exports.verifyRequest = (req, res, next) =>{
    var jobId;
    var userId;

    if(req.params){
        if(req.params.jobId){
            jobId = req.params.jobId;
        }else if(req.params.userId){
            userId = req.params.userId;
        }
    }
    if(req.body){
        if(req.body.jobId){
            jobId = req.body.jobId;
        }else if(req.body.userId){
            userId = req.body.userId;
        }
    }

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

