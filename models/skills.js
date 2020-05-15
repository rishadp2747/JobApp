var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/* Defining the Schema for Skills model */
const SkillSchema = new Schema({
    title          : { 
                     type : String, 
                     required:true
                     },
    basic_charge   : { 
                     type : Number, 
                     required:true
                     },
    hourly_charge  : { 
                     type : Number, 
                     required:true
                     },
    created_by     : { 
                     type : ObjectId, 
                     ref: "Admins"
                     }
                     },
    { timestamps : true });

/* Creating the Skills model */
module.exports =  mongoose.model('Skill', SkillSchema);