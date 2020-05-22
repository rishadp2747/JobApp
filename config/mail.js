const nodemailer = require("nodemailer");
const dotenv = require('dotenv');
dotenv.config();

module.exports = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: 587,
    auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD
    }
  });
