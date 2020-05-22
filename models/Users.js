var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');
var mongooseTypePhone = require('mongoose-type-phone');
var beautifyUnique = require('mongoose-beautiful-unique-validation');

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
        validate: {
            validator: function(value) {
                if(!Number.isInteger(value))
                    return false;
            },
            message: props => `${props.value} is not a valid age!`
        }
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
        required: [true, 'Not a valid phone number'],
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
        unique: 'Two users cannot share the same username ({VALUE})'
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

userSchema.plugin(beautifyUnique);
userSchema.plugin(passportLocalMongoose, {
    usernameField: 'phone'
  });


  

module.exports = mongoose.model('User', userSchema);