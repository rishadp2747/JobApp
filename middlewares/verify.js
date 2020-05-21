var user = require('../models/Users');


exports.verifyEmail = (email) => {
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