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
            created_at     : Date,
            updated_at     : Date                 
        
        }, {collection : "Skills"});

/* Creating the Skills model */
var skills = mongoose.model('skills', skillSchema);