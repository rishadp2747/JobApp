var user = require('../models/Users');
var job =   require('../models/Jobs');


exports.verifyPhone = (userId) => {
    return new Promise((resolve, reject) => {
        user.findOne({'_id' : userId, phoneVerify : true},(err,user) => {
            if(err){
                return reject({status: false, err: 'USerError', info :'Phone number not verified yet'});
            }
            if(user) {
                return resolve({status :true, data: user, info :  'Phone number verified'})
            }else{
                return reject({status: false, err: 'VerificationError', info :'Phone number not verified yet'});
            }
        });
    });
};


exports.jobStatus = (jobId) => {
    return new Promise((resolve, reject) => {
        console.log(jobId);
        job.findOne({'_id' : jobId}, (err,job) => {
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