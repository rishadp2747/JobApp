var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser')
router

//to list all available skills
.get('/',function(req,res,next){
skills.find()
  .then(function(doc){
    res.json({success : true, data : doc , message : "Skills listed successfully"})
  })
  .catch((err)=>res.json({success : false ,data : err, message: "Skills listing failed"})
  );
})

//to create new skill
.post('/',function(req,res,next){
  var item = req.body;
var data = new skills(item);
data.save()
  .then(()=> res.json({success : true, message:"Skill successfully added"}))
  .catch((err)=>res.json({success : false, data: err,message:"Skill adding failed"}));
})


//to get a particular skill
.get('/:skillId',function(req,res,next){
  skills.findById(req.params.skillId)
    .then(function(doc){
      res.json({success : true,data : doc,message : "skill listed successfully"})
    })
    .catch((err)=>
      res.json({success : false,data : err,message: "skill listing failed" })
    );
})

//to update a particular skill
.put('/:skillId',function(req,res,next){
  var id = {_id : req.params.skillId};
  skills.findByIdAndUpdate(id, req.body)
  .then(function(doc){
    res.json({success:true,data : doc ,message : "skill updated successfully"})
  })
  .catch((err)=>
    res.json({success : false , data : err, message : "skill update failed"})
  );
})

//to delete a particular skill
.delete('/:skillId',function(req,res,next){
  skills.findByIdAndDelete(req.params.skillId)
  .then(function(doc){
    res.json({success : true, data : doc , message : "Skill deleted successfully"})
  })
  .catch((err)=>
    res.json({success : false , data : err , message : "skill deletion failed"})
  )
});

module.exports = router;