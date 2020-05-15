var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const AdminSchema = new Schema({
  username  : {
              type : String,
              unique : true
              },
  password  : {
              type : String ,
              required : 'This is a required field'
              },
  name      : {
               type: String,
               required : true
              },
  email     : {
              type : String ,
              required : true ,
              lowercase : true ,
              unique : true
              },
  timestamps : true
});
module.exports =  mongoose.model('Admin', AdminSchema);
