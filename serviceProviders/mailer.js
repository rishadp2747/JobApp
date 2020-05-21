const transporter = require('../config/mail');
const ejs = require('ejs');
var path = require('path');
var otpGenerator = require('otp-generator');
const dotenv = require('dotenv');
dotenv.config();

 


exports.emailVerifier = function (user, mail, done) {

    var otp = otpGenerator.generate(4, { upperCase: false, specialChars: false, alphabets: false });
    ejs.renderFile(path.resolve(__dirname, '..', 'vendor/mail/emailVerification.ejs'), 
        { 
            app: process.env.APP_NAME, 
            name: user, 
            otp : otp
        }, 
    (err, data) => {
        if(err){
            return done(err,false);
        }else{
            transporter.sendMail({
                from: '"FCS OTP Verifier" <mail@fcs.net.in>', // sender address
                to: mail, // list of receivers
                subject: process.env.APP_NAME+" : email verification", // Subject line
                html: data, // html body
            } ,(err) => {
                if(err){
                    console.log(err);
                    return done(err,false);
                }else{
                    
                    return done(null, otp);
                }
               
            });
        }
    });
}




exports.resetVerify = function(user, mail){
    return new Promise((resolve, reject) => {
        var otp = otpGenerator.generate(4, { upperCase: false, specialChars: false, alphabets: false });
        ejs.renderFile(path.resolve(__dirname, '..', 'vendor/mail/emailVerification.ejs'), 
            { 
                app: process.env.APP_NAME, 
                name: user, 
                otp : otp
            },(err, data) => {
                if(err){
                    reject(err);
                }else{
                    transporter.sendMail({
                        from: '"FCS OTP Verifier" <mail@fcs.net.in>', // sender address
                        to: mail, // list of receivers
                        subject: process.env.APP_NAME+" : email verification", // Subject line
                        html: data, // html body
                    } ,(err) => {
                        if(err){
                            reject(err);
                        }else{
                            resolve(otp);
                        }
                    });
                }
        });
    });
}