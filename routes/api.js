var express = require('express');
var router = express.Router();
var users = require('../models/users');


router.get('/users' , function(req,res,next){
  res.send('available users');
  res.json([{
           username: 'amar',
           age     : '19'
            },
            {
              username:'raj',
              age     : '20'
            }])
})

 // get details of particular user
.get('/users/:userId',function(req,res,next){
  res.send('this is user'+req.params.userId);

})
// register a new user
.post('/users/register',function(req,res,next) {
  res.json({
            username: req.body.username ,
            password: req.body.username
           });
})
.post('/users/login',function(req,res,next) {
  res.json({
          username : req.body.username,
          status   :req.body.status
  });
})
.put('/users/:userId',function(req,res,next) {

})
.delete('/users/:userId',function(req,res,next){

});
module.exports = router;
