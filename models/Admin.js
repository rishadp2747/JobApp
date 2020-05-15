var mongoose = require('mongoose');
var Schema = mongoose.Schema;
require('mongoose-type-email');
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
                work: {
                  type: mongoose.SchemaTypes.Email,
                  required: true
                     },
                home: {
                  type: mongoose.SchemaTypes.Email,
                  required: true
                      }
              },
  { timestamps : true }
});
module.exports =  mongoose.model('Admin', AdminSchema);
