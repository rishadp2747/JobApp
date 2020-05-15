var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');
var mongooseIntlPhoneNumber = require('mongoose-intl-phone-number');

require('mongoose-type-email');
const Email = mongoose.Types.Email;

const ratingSchema = new Schema({
    job : {
        type : mongoose.Schema.Types.ObjectId,
        ref  : 'Job' ,
        require : true
    },
    offeredBy : {
        type : mongoose.Schema.Types.ObjectId,
        ref  : 'User',
        required : true
    },
    score   : {
        type : Number,
        min  : 0,
        max  : 5.0,
        required : true
    }
});

const userSchema = new Schema({
    name : {
        type : String,
        required : true
    },
    age : {
        type : Number,
        required : true,
    },
    sex : {
        type : String,
        enum : ['male', 'female', 'other'],
        default : 'male',
        required : true
    },
    location : {
        type: {
            type: String, 
            enum: ['Point'], 
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    email : {
        type : Email,
    },
    skills : [{
        type : mongoose.Schema.Types.ObjectId,
        ref  : 'Skill'
    }],
    rating : [ratingSchema],
},{
    timestamps : true
});



userSchema.plugin(passportLocalMongoose);
userSchema.plugin(mongooseIntlPhoneNumber, {
    hook : 'Validate',
    phoneNumberField : 'phone'
});

module.exports = mongoose.model('User', userSchema);