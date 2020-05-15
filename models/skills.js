var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/* Creating connection with mongoDB server */
mongoose.connect('mongodb://localhost:27017/jobapp');

     /* Defining the Schema for Skills model */
        var SkillSchema = new Schema({
        	
        	id             : { type : String, required:true},
        	title          : { type : String, required:true},
        	basic_charge   : { type : Decimal128, required:true},
        	hourly_charge  : { type : Decimal128, required:true},
        	created_by     : { type : ObjectId, ref: "Admins"},
            created_at     : { type : Date, timestamps : true},
            updated_at     : { type : Date, timestamps : true}                
        
        });

/* Creating the Skills model */
var skills = mongoose.model('Skill', SkillSchema);
module.exports = skills;