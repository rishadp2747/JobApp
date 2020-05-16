var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/' , function(req,res,next){
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
.get('/:userId',function(req,res,next){
  res.send('this is user'+req.params.userId);

})
// register a new user
.post('/register',function(req,res,next) {
  res.json({
            username: req.body.username ,
            password: req.body.username
           });
})
.post('/login',function(req,res,next) {
  res.json({
          username : req.body.username,
          status   :req.body.status
  });
})
.put('/:userId',function(req,res,next) {

})
.delete('/:userId',function(req,res,next){

});
module.exports = router;
