var user = require('../models/Users');
var Job =   require('../models/Jobs');

var response = require('../serviceProviders/responser');

exports.verifyPhone = (userId) => {
    return new Promise((resolve, reject) => {
        user.findOne({'_id' : userId},(err,user) => {
            if(err){
                return reject({status: false, err: 'ConnectionError', info :'Server Error please contact administrator'});
            }
            if(user) {
                if(user.phoneVerify){
                    return resolve({status :true, data: user, info :  'Phone number verified'})
                }else{
                    return reject({status: false, err: 'VerificationError', info :'Phone number not verified yet'});
                }
                
            }else{
                return reject({status: false, err: 'UserError', info :'No such user found'});
            }
        });
    });
};


exports.jobStatus = (jobId) => {
    return new Promise((resolve, reject) => {
        Job.findOne({'_id' : jobId, 'status' : { "$in" : ["active", "pending"] } } , (err,job) => {
            
            if(err){
                return reject({status : false, err: 'JobError', info : 'No such job found'});
            }
            if(job) {
    
                return resolve({status : true, data : job, info : 'Active job'})
            }else{
                return reject({status : false, err : 'ValidationError', info : 'This job is not active'})
            }
        });
    });
}

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
}

exports.jobOwner = (req, res, next) =>{
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
}

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


/*
exports.verifyRequest = (jobId, userId) => {

    return new Promise( (resolve, reject) => {
        Job.findOne({'_id' : jobId, 'requests' : userId }, (err, job) => {
            if(err) {
                return reject({status : false, err : err.name, info : err.message});
            }

            if(job){
                return resolve({status : true, data : job, info : 'Verified the request'})
            }else{
                return reject({status : false, err : 'ValidationError', info : 'User not requested for this job or just cancelled the request'})
            }
        })
    });
}*/

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

}



exports.verifyCommit = (jobId) =>{
    return new Promise( (resolve, reject) => {
        Job.findOne({'_id' : jobId}, (err, job) => {
            if(err){
                return reject({status : false, err : err.name, info : err.message});
            }
            if(job){
                if(job.status === 'commit' && job.commitedBy != null){
                    return resolve({status : true, data : job, info : 'Job status commit verified'});
                }else{
                    return reject({status : false, err : 'VerificationError', info : 'Job status is not connit'});
                }
            }else{
                return reject({status : false, err : 'UserError', info : 'No such user found'});
            }
        })

    });
}