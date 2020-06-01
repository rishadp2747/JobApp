var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

var Skills = require('../models/Skills');
var skill  = require('../middlewares/jobMiddlewares');

response = require('../serviceProviders/respondent');

const skillsRouter = express.Router();
skillsRouter.use(bodyParser.json());

skillsRouter.route('/')
.get((req,res,next) => {
  Skills.find({},'_id title basicCharge hourlyCharge',(err, skill) => {
    if(err){
      response.errorResponse(res, 500, 'ServerError', 'Please contact administrator');
    }
    if(skill){
      response.dataResponse(res, 200, skill, 'Successfully listed the skills');
    }else{
      response.errorResponse(res, 400, 'ListError', 'Failed to list skills');
    }
  })
})
.post((req,res,next) => {
  var skill = new Skills (req.body);
  skill.save( (err) => {
    if(err){
      response.errorResponse(res, 500, 'ServerError', 'please contact administrator');
    }else{
      response.dataResponse(res, 201, skill, 'Successfully created the skill');
    }
  })
    
});



module.exports = skillsRouter;
