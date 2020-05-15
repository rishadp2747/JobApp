var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
var Schema = mongoose.Schema;
mongoose.connect('mongodb://localhost:27017/database');
var AdminSchema = new Schema({
  username  : { type : String, unique : true },
  password  : {type : String , required : 'This is a required field'},
  name      : String,
  email     : { type : String ,required : true ,  lowercase : true , unique : true }
})
AdminSchema.plugin(timestamps);
var Admin = mongoose.model('Admin',AdminSchema);
