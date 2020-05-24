var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/Users');
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var jwt = require('jsonwebtoken');
var config = require('../config/auth');



/*
exports.local = passport.use(new LocalStrategy({
    usernameField   : 'phone',
    passwordField   : 'password'

},User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
*/

exports.userRegister = passport.use('userRegister', new LocalStrategy ({
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
                        return done(null, false, "Not a valid skills set provided");
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
        });
    });
}));


passport.use('userLogin', new LocalStrategy({
    usernameField : 'phone',
    passwordField : 'password',
    passReqToCallback : true
}, (req, phone, password, done) =>{
    User.findOne({'phone' : phone}, (err, user) => {
        if(err)
            return done(err);
        if(!user){
            return done(null, false, 'Username or Password is not correct');
        }
        if(!user.validPassword(password))
            return done(null, false, 'Username or Password is not correct');
        return done(null, user)
    });
}));


exports.getToken = function(user) {
    return jwt.sign(user, config.secretKey, {
        expiresIn : 3600 
    });
};

var opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.secretKey;

exports.jwtPassport = passport.use(new JwtStrategy(opts,
    (jwt_payload, done) => {
        User.findOne({_id: jwt_payload._id}, (err, user) => {
            if (err) {
                return done(err, false);
            }
            else if (user) {
                return done(null, user);
            }
            else {
                return done(null, false);
            }
        });
    }));


exports.verifyUser = passport.authenticate('jwt', {session : false}); //no session used 
