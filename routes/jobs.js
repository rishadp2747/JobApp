var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');



var authenticate = require('../middlewares/user');

var User = require('../models/Users');
var Job  =  require('../models/Jobs');

var radius = require('../serviceProviders/distance');

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
    .post(function(req, res, next) {
        var item = req.body;
        var data = new Job(item);
        data.save()
            .then(()=> res.json({success : true, message : "Job Successfully added"}))
            .catch((err) => 
                res.json({success : false, data : err, message : "Job Adding Failed"})
                );
        });

    


module.exports = jobsRouter;