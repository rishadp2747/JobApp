var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

var Skills = require('../models/Skills');


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
  var skill = new Skills (req.body).save()
    .then( (skill) => {
      res.statusCode = 200;
      res.json({
        success : true,
        message : "Successfully added new skill"
      });
    }, (err) => {
      if(err.errors){
        if(err.errors.createdBy){
          res.statusCode = 400;
          res.json({
            success : false,
            err     : err.errors.createdBy.name,
            message : err.errors.createdBy.message
          });
        }
      }else{
        res.statusCode = 400;
        res.json({
          success : false,
          err     : err.name,
          message : err.message
        });
      }
    })
    .catch( (err) =>{
      res.statusCode = 500;
      res.json({
        success : false,
        err     : err.name,
        message : err.message 
      });
    });
});



module.exports = skillsRouter;