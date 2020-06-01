var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var Admin = require('../models/Admins');
var validator = require('./validator');

const response = require('../serviceProviders/respondent');

passport.use('adminLogin', new LocalStrategy({
    usernameField : 'email',
    passwordField : 'password',
    passReqToCallback : true
}, (req, email, password, done) =>{
    Admin.findOne({'email' : email}, (err, admin) => {
        if(err)
            return done(null);
        if(!admin){
            return done(null, false, 'Email or Password is not correct');
        }
        if(!admin.validPassword(password))
            return done(null, false, 'Email or Password is not correct');
        return done(null, email)
    });
}));

passport.use('adminRegister', new LocalStrategy ({
    usernameField : 'email',
    passwordField   :   'password',
    passReqToCallback : true
},(req, email, password, done) => {
    process.nextTick( () => {
        Admin.findOne({'email' : email }, (err, admin) => {
            if(err){
               return done(err);
            }
            if(admin){
               return done(null, false, 'Admin with this mail already exist');
            }else{  
                validator.passwordValidator(password)
                .then( (result) => {
                    if(result){
                        var newAdmin = new Admin();
                        newAdmin.password    = newAdmin.generateHash(password);
                        newAdmin.email       = req.body.email;
                        newAdmin.name        = req.body.name;
                        newAdmin.superAdmin  =  false;
                        newAdmin.save( (err) => {
                            if(err){
                                return done(null, false, err.message);
                            }      
                            return done(null, newAdmin);
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


exports.adminLogin =  (req, res, next) => {
    passport.authenticate("adminLogin", (err, user, info) => {
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

exports.adminRegister = (req, res, next) => {
    passport.authenticate("adminRegister", (err, user, info) => {
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
    


    