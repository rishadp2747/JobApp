var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');
require('mongoose-type-email');

const adminSchema = new Schema({
  name : {
    type  : String,
    required  : true
  },
  password : {
    type : String,
    required : true
  },
  email : {
    type: mongoose.SchemaTypes.Email,
    required: true
  },
  superadmin : {
    type  : Boolean,
    default : false
  }
},{ 
  timestamps : true 
});
adminSchema.plugin(passportLocalMongoose);


// generating a hash
adminSchema.methods.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checks if password is valid
adminSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.password);
};


module.exports =  mongoose.model('Admin', adminSchema);
