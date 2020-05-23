var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');
require('mongoose-type-email');

const adminSchema = new Schema({
  name : {
    type  : String,
    required  : true
  },
  email : {
    type: mongoose.SchemaTypes.Email,
    required: true
  },
  superUser : {
    type  : Boolean,
    default : false
  }
},{ 
  timestamps : true 
});
adminSchema.plugin(passportLocalMongoose);
module.exports =  mongoose.model('Admin', adminSchema);
