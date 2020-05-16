var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var Admin = require('../models/Admins');
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var jwt = require('jsonwebtoken');


var config = require('../config/auth');


exports.local = passport.use(new LocalStrategy(Admin.authenticate()));
passport.serializeUser(Admin.serializeUser());
passport.deserializeUser(Admin.deserializeUser());

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
        console.log("JWT payload: ", jwt_payload.__id);
        Admin.findOne({_id: jwt_payload.__id}, (err, user) => {
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


exports.verifyAdmin = passport.authenticate('jwt', {session : false}); //no session used 


