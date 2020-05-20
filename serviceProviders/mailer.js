const transporter = require('../config/mail');
const ejs = require('ejs');

exports.emailVerifier = (user, otp, mail, next) => {
    ejs.renderFile(__dirname + "/vendor/mail/emailVerification.ejs", { app: process.env.APP_NAME, name: user, otp : otp}, (err, data) => {
        if(err){
            console.log(err);
            next(err);
        }else{
            transporter.sendMail({
                from: '"FCS OTP Verifier" <mail@fcs.net.in>', // sender address
                to: mail, // list of receivers
                subject: process.env.APP_NAME+" : email verification", // Subject line
                html: data, // html body
            } ,(err) => {
                console.log(err);
                next(err);
            });
        }
    });
}

