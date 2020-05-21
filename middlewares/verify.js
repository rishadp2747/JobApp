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
            if(user.verifyEmail.verify){
                return resolve(user)
            }else{
                return reject(new Error('Email not verified Yet'));
            }
        })
        .catch( (err) =>{
            return reject(new Error('No such user found'));
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


