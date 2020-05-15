var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/* Creating connection with mongoDB server */
mongoose.connect('mongodb://localhost:27017/jobapp');

     /* Defining the Schema for Skills model */
        var skillSchema = new Schema({
        	
        	_id            : String,
        	title          : String,
        	basic_charge   : Decimal128,
        	hourly_charge  : Decimal128,
        	created_by     : {
                               type: ObjectId,
                               ref: "Admins"
                             },
            timestamps     : true                
        
        });

/* Creating the Skills model */
var skills = mongoose.model('Skill', skillSchema);
module.exports = skills;