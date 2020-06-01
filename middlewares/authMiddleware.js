var passport = require('passport');
var User = require('../models/Users');

var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var jwt = require('jsonwebtoken');
var config = require('../config/auth');


const Admin = require('../models/Admins');


var opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();

opts.secretOrKey = config.secretKey;


exports.jwtPassport = passport.use(new JwtStrategy(opts,
    (jwt_payload, done) => {
        if(jwt_payload.admin == true){
            Admin.findOne({_id: jwt_payload._id}, (err, user) => {
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
        }else{
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
        }

    }));



exports.verifyUser = (req, res, next) => {
    passport.authenticate('jwt', {session : false}, (err, user) => {
        if(user){
            req.user = user
            return next();
        }
        if(!user){
            response.errorResponse(res, 401, 'TokenError', 'AuthenticationFailed');
        }
        if(err){
            response.errorResponse(res, 500, err.name, err.message);
        }
    })(req, res, next);
};