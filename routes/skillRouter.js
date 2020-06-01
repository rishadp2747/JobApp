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
  Skills.find({},'_id title basicCharge hourlyCharge')
    .then((skills) => {
      res.statusCode = 200;
      res.json({
        success : true,
        data    : skills,
        message : "Successfully Listed all skills"
      });
    })
    .catch( (err) =>{
      res.statusCode = 500;
      res.json({
        success : false,
        err     : err.name,
        message : err.message
      });
    });
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
