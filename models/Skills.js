var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var idvalidator = require('mongoose-id-validator');



/* Defining the Schema for Skills model */
const skillSchema = new Schema({
    title          : { 
                     type : String, 
                     required:true
                     },
    basicCharge   : { 
                     type : Number, 
                     required:true
                     },
    hourlyCharge  : { 
                     type : Number, 
                     required:true
                     },
    createdBy     : { 
                     type : mongoose.Schema.Types.ObjectId,
                     ref: "Admin"
                     }
            },
    { timestamps : true });

/* Creating the Skills model */
skillSchema.plugin(idvalidator, {
    message : 'Invalid Admin who are you',
  });
module.exports =  mongoose.model('Skill', skillSchema);