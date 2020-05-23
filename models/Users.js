var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');
var mongooseTypePhone = require('mongoose-type-phone');
var beautifyUnique = require('mongoose-beautiful-unique-validation');
var bcrypt   = require('bcrypt');
require('mongoose-type-email');


mongoose.SchemaTypes.Email.defaults.message = 'Email address is invalid'
 
// admin 5ec9778eb89b74423a02d2dd

//

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
    password : {
        type    :   String,
        required    :   [true, 'Password field is required'],
    },
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
        enum : {values : ['male', 'female', 'others'], message : 'Not a valid sex value'},
        required : [true , 'Sex field is required'],
    },
    location : {
        type: {
            type: String, 
            enum: { values : ['Point'], message : 'Not a valid location type'}, 
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
        unique : 'User with this phone number already exist ({VALUE})',
        allowedNumberTypes: [mongooseTypePhone.PhoneNumberType.MOBILE],
    },
    phoneVerify : {
        type : Boolean,
        default : true,
    },
    email : {
        type : mongoose.SchemaTypes.Email,
        allowBlank : false,
        required : [true, 'Email field is required'],
        unique: 'User with this email is already exist ({VALUE})'
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

// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checks if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};


  

module.exports = mongoose.model('User', userSchema);