var mongoose = require('mongoose');
var Schema = mongoose.Schema;
require('mongoose-type-email');
const passportLocalMongoose = require('passport-local-mongoose');
const AdminSchema = new Schema({
  name      : {
               type: String,
               required : true
              },
  email     : {
                type: mongoose.SchemaTypes.Email,
                required: true
                },
  { timestamps : true }
});
User.plugin(passportLocalMongoose);
module.exports =  mongoose.model('Admin', AdminSchema);
