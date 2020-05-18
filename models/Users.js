var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');
var mongooseTypePhone = require('mongoose-type-phone');
 

require('mongoose-type-email');


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
        enum : ['male', 'female', 'others'],
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
    phone: {
        type: mongoose.SchemaTypes.Phone,
        required: true,
        allowedNumberTypes: [mongooseTypePhone.PhoneNumberType.MOBILE],
        phoneNumberFormat: mongooseTypePhone.PhoneNumberFormat.INTERNATIONAL, // can be omitted to keep raw input
        defaultRegion: 'IND',
    },
    email : {
        type : mongoose.SchemaTypes.Email
        
    },
    skills : [{
        type : mongoose.Schema.Types.ObjectId,
        ref  : 'Skill'
    }],
    rating : [ratingSchema],
    facebookId : {
        type : String
    },
    googleId : {
        type : String
    }
},{
    timestamps : true
});

userSchema.plugin(passportLocalMongoose);


module.exports = mongoose.model('User', userSchema);