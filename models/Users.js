var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');
var mongooseTypePhone = require('mongoose-type-phone');
const bcrypt = require('bcrypt');

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

const emailVerification = new Schema({
    verify : {
        type : Boolean,
        default : false
    },
    OTP : {
        type    : String,
        maxlength : 4,
    }
},{
    timestamps : true
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
        required: [true, 'Phone number is required'],
        unique : true,
        allowedNumberTypes: [mongooseTypePhone.PhoneNumberType.MOBILE],
    },
    phoneVerify : {
        type : Boolean,
        default : true,
    },
    email : {
        type : mongoose.SchemaTypes.Email,
        required : true,
        unique : true
    },
    emailVerify : {
        type : emailVerification,
    },
    resetVerify : {
        type : emailVerification,
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

userSchema.plugin(passportLocalMongoose, {
    usernameField: 'phone'
  });
userSchema.methods.comparePassword = function(password, callBack) {
    bcrypt.compare(password, t, function(err, isMatch) {
        console.log(err);
        console.log(isMatch);
       return callBack(err, isMatch);
    });
};

module.exports = mongoose.model('User', userSchema);