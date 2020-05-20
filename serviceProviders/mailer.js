transporter = require('../config/mail');

exports.emailVerifier = (req, res, next) => {
    return transporter.sendMail({
        from : '"Email Verifier" <mail@fcs.net.in>',
        to : req.body.email,
        subject : process.env.APP_NAME+" : email verification",

    })
}

