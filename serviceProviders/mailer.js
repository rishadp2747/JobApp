transporter = require('../config/mail');

exports.emailVerifier = (req, res, next) => {
    return transporter.sendMail({
        from : '"Email Verifier" <mail@fcs.net.in>',
        to : req.body.email,
        subject : ""
    })
}



let x = transporter.sendMail({
    from: '"mail" <mail@fcs.net.in>', // sender address
    to: "rishadp2747@gmail.com", // list of receivers
    subject: "Hello ✔", // Subject line
    text: "Hello world?", // plain text body
    html: "<b>Hello world?</b>", // html body
  } ,(err) => {
    console.log(err);
  });
  