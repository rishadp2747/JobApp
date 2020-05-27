var express = require('express');
var bodyParser = require('body-parser');
var multer = require('multer');

var storage = multer.diskStorage({
    destination : (req, file, cb) => {
        cb(null, 'public/images/profile');
    }
});

const uploadRouter = express.Router();
uploadRouter.use(bodyParser.json());

uploadRouter.route('/profile_image')
    .post()


module.exports = uploadRouter;