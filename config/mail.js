const nodemailer = require("nodemailer");

module.exports = nodemailer.createTransport({
    host: 'smtp.sendgrid.net',
    port: 587,
    auth: {
        user: 'apikey',
        pass: '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'
    }
  });
