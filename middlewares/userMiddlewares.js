var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/Users');
var validator = require('./validator');

const response = require('../serviceProviders/respondent');

passport.use('userLogin', new LocalStrategy({
    usernameField : 'phone',
    passwordField : 'password',
    passReqToCallback : true
}, (req, phone, password, done) =>{
    User.findOne({'phone' : phone}, (err, user) => {
        if(err)
            return done(null);
        if(!user){
            return done(null, false, 'Phone number or Password is not correct');
        }
        if(!user.validPassword(password))
            return done(null, false, 'Phone number or Password is not correct');
        return done(null, user)
    });
}));

passport.use('userRegister', new LocalStrategy ({
    usernameField : 'phone',
    passwordField   :   'password',
    passReqToCallback : true
},(req, phone, password, done) => {
    process.nextTick( () => {
        User.findOne({'phone' : phone }, (err, user) => {
            if(err){
               return done(err);
            }
            if(user){
               return done(null, false, 'User with phone number already exist');
            }else{  
                validator.passwordValidator(password)
                .then( (result) => {
                    if(result){
                        var newUser = new User();
                        newUser.phone       = phone;
                        newUser.password    = newUser.generateHash(password);
                        newUser.email       = req.body.email;
                        newUser.location    = req.body.location;
                        newUser.age         = req.body.age;
                        newUser.name        = req.body.name;
                        newUser.sex         = req.body.sex;
                        if(req.body.skills){
                            newUser.skills = req.body.skills;
                            var error = newUser.validateSync();
                            if(error){
                                if(error.path == "skills"){
                                    return done(null, false, "Not a valid skills set provided");
                                }
                            }
                            
                        }
                        newUser.save( (err) => {
                            if(err){
                                if(err.errors){
                                    if(err.errors.email){
                                        return done(null, false, err.errors.email.message);
                                    }
                                }
                                return done(null, false, err.message);
                            }      
                            return done(null, newUser);
                        });
                    }
                }, (err) => {
                    if(err) {
                        return done(null, false, err.info);
                    }
                })
                   
               
            }
        });
    });
}));


exports.userLogin =  (req, res, next) => {
    passport.authenticate("userLogin", (err, user, info) => {
        if(err){
            response.errorResponse(res, 500, 'ServerError', 'Please contact adminstrator');
        }
        if(user){
            req.user = user;
            return next();
        }else{
            response.errorResponse(res, 400, 'ValidationError', info);
        }
    })(req, res, next);
}

exports.userRegister = (req, res, next) => {
    passport.authenticate("userRegister", (err, user, info) => {
        if(err){
            response.errorResponse(res, 500, 'ServerError', 'Please contact adminstrator');
        }
        if(user){
            req.user = user;
            return next();
        }else{
            response.errorResponse(res, 400, 'ErrorFields or ValidationError', info);
        }
    })(req, res, next);
}
    




exports.verifyPhone = (req, res, next) => {
    User.findOne({'_id' : req.user._id, 'phoneVerify' : true}, (err, user) =>{
        if(err){
            response.errorResponse(res, 500, 'ServerError', 'Please contact administrator Error:MDU100');
        }
        if(user){
            return next();
        }else{
            response.errorResponse(res, 401, 'ValidationError', 'User not verified phone number yet !');
        }
        
    })
}
    
    