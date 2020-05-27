var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var passport = require('passport');



var user = require('../middlewares/user');
var job  =  require('../middlewares/verify'); 

var User = require('../models/Users');
var Job  =  require('../models/Jobs');

var jobsRouter = express.Router();
jobsRouter.use(bodyParser.json());

jobsRouter.route('/')
    .get()
   

    


module.exports = jobsRouter;