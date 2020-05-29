var user = require('../models/Users');
var Job =   require('../models/Jobs');


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

exports.jobOwner = (jobId, userId) => {
    return new Promise( (resolve, reject) => {
        Job.findOne({'_id' : jobId, 'postedBy' : userId}, (err, job) => {
            if(err){
                return reject({status : false, err: 'JobError', info : 'No such job found'});
            }
            if(job) {

                return resolve({status : true, data : job, info : 'Owner verified'})
            }else{
                return reject({status : false, err : 'ValidationError', info : 'You are not owner of this job'})
            }
        })
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
}
