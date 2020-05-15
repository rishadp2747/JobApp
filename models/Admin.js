var mongoose = require('mongoose');
var Schema = mongoose.Schema;
mongoose.connect('mongodb://localhost:27017/database');
const AdminSchema = new Schema({
  username  : {
              type : String,
              unique : true
              },
  password  : {
              type : String ,
              required : 'This is a required field'
              },
  name      : String,
  email     : {
              type : String ,
              required : true ,
              lowercase : true ,
              unique : true
              },
  timestamps : true
});
module.exports =  mongoose.model('Admin', AdminSchema);
