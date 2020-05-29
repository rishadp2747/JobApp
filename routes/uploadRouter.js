var express = require('express');
var bodyParser = require('body-parser');
var multer = require('multer');
var fs = require('file-system');

var user


var storage = multer.diskStorage({
    destination : (req, file, cb) => {
        cb(null, 'public/images/profile');
    }
});

const imageFileFilter = (req, file, cb) => {
    if(!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
        return cb(new Error('You can upload only image files!'), false);
    }
    cb(null, true);
};

const upload = multer({ storage: storage, fileFilter: imageFileFilter});

const uploadRouter = express.Router();
uploadRouter.use(bodyParser.json());

uploadRouter.route('/profile_image')
    .post((req,res, next) =>{
        
        const imgdata = req.body.img;
 
        // to convert base64 format into random filename
        const base64Data = imgdata.replace(/^data:([A-Za-z-+/]+);base64,/, '');
        
        fs.writeFileSync('x.jpeg', base64Data,  {encoding: 'base64'});
    });


module.exports = uploadRouter;