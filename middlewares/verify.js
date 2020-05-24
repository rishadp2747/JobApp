var user = require('../models/Users');
var ObjectId = require('mongodb').ObjectId; 

exports.checkEmail = (email) => {
    return new Promise((resolve, reject) => {
        user.findOne({'email' : email})
        .then( (user) => {
            return resolve(user);
        })
        .catch( (err) => {
            return reject(new Error ('No such user'));
        })
    });
}

exports.verifyEmail = (userId) => {
    return new Promise( (resolve, reject) => {
        user.findOne({'_id' : userId})
        .then( (user) => {
            if(user){
                if(user.emailVerify.verify){
                    return resolve(user)
                }else{
                    return reject("Email not verified yet");
                    
                }
            }else{
                return reject("No such user found");
            }
            
        })
        .catch( (err) =>{
            return reject("Failed to find user from database");
        })
    });
}

exports.verifyReset = (userId) => {
    return new Promise( (resolve, reject) => {
        user.findOne({ 'resetVerify._id' : userId})
        .then( (user) => {
            if(user){
                if(user.resetVerify.verify == true){
                    return resolve(user)
                }else{
                    return reject('User not verified yet for resetting password');
                }
            }else{
                return reject("No such user found");
            }
        })
        .catch( (err) =>{
            return reject("No such user found");
        })
    });
}


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