var mongoose = require('mongoose');
var Schema = mongoose.Schema;
/* Creating connection with mongoDB server */
mongoose.connect('mongodb://localhost:27017/jobapp');

/* Defining the Schema for Skills model */
const SkillSchema = new Schema({
    title          : { 
                     type : String, 
                     required:true
                     },
    basic_charge   : { 
                     type : Decimal128, 
                     required:true
                     },
    hourly_charge  : { 
                     type : Decimal128, 
                     required:true
                     },
    created_by     : { 
                     type : ObjectId, 
                     ref: "Admins"
                     }},
    { timestamps : true });

/* Creating the Skills model */
module.exports =  mongoose.model('Skill', SkillSchema);