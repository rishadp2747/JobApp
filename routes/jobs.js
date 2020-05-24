var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');



var authenticate = require('../middlewares/user');
var verify       =  require('../middlewares/verify'); 

var User = require('../models/Users');
var Job  =  require('../models/Jobs');


const jobsRouter = express.Router();
jobsRouter.use(bodyParser.json());

jobsRouter.route('/')
    .get( authenticate.verifyUser, (req, res, next) => {
        User.findOne({'_id' : req.user._id})
            .then( (user) => {
                userCoordinates = user.location.coordinates;
                return Job.find({},'title description dateFrom dateTo timeFrom timeTo skill status ').populate({
                    path : 'postedBy',
                    match: { 
                                location:
                                    { $near :
                                        {
                                        $geometry: { type: "Point",  coordinates: userCoordinates },
                                        $minDistance: 0000,
                                        $maxDistance: 5000

                                        }
                                    }
                            },
                    select: 'name phone email location'
                });
            }, (err) => {
                res.statusCode = 401;
                res.json({
                    success : false,
                    error   :   err.name,
                    message : 'No such user found' 
                });
            })
            .then( (job) => {
                let filteredJobs = [];
                job.forEach((value, index) =>{
                    if(value.postedBy != null){
                        filteredJobs.push(value);
                    }
                });
                res.statusCode = 200;
                res.json({
                    success : true,
                    data    : filteredJobs,
                    message : "Successfully listed the jobs" 
                });
            },(err) => {
                res.statusCode = 500;
                res.json({
                    success : false,
                    error   :   err.name,
                    message : 'Failed to fetch the jobs' 
                });
            });
            
    })
    .post( authenticate.verifyUser,(req, res, next) =>  {

        verify.verifyPhone(req.user._id)
            .then( (result) => {
                if(result){

                    var job = new Job(req.body);
                    job.save()
                        .then(() => {
                            res.statusCode = 201;
                            res.json({
                                success : true,
                                message :   "Successfully posted the job"
                            });
                        }, (err) => {
                            res.statusCode = 400;
                            res.json({
                                success :   false,
                                error   :   err.name,
                                message :   err.message 
                            });
                        });

                }
            }, (err) => {
                if(err){
                    res.statusCode = 401;
                    res.json({
                        success : false,
                        error   : err.err,
                        message :   err.info
                    })
                }
            });
        });

        

    


module.exports = jobsRouter;