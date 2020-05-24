const mongoose = require('mongoose');
const Schema  = mongoose.Schema;
const arrayUniquePlugin = require('mongoose-unique-array');
var beautifyUnique = require('mongoose-beautiful-unique-validation');

const TimeSchema = new Schema({
    hr: {
        type: Number, 
        required: true, 
        min: 0, 
        max: 12
    },
    min: {
        type: Number, 
        required: true,
        min: 0, 
        max: 59
    },
    sec: {
        type: Number, 
        required: true, 
        min: 0, 
        max: 59
    },
    day: {
        type: Boolean,
        require: true,
        default: true
    }
});

const jobSchema = new Schema({

    title : {
        type : String,
        required : true
        
    },
    description : {
        type : String, 
        required : true
        
    },
    dateFrom : {
        type : Date, 
        required : true
        
    },
    dateTo : {
        type : Date, 
        required : true
        
    },
    timeFrom : {
        type : TimeSchema, 
        required : true
        
    },
    timeTo : {
        type : TimeSchema, 
        required : true
        
    },
    skill : { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Skill',
        required : [true, 'What type skills required for this job']
    },
    status : {
        type: String,
        enum : ['active', 'pending', 'commit', 'completed', 'rejected'],
        default: 'active'
    },
    postedBy : {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' ,
        required : [true, 'Who is posting this job']
    },
    commitedBy : { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User' 
    },
    requests : [{ 
        type : mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        unique :'You already requested for this job'
    }]
    
},{
    timestamps : true
});

jobSchema.plugin(beautifyUnique);
jobSchema.plugin(arrayUniquePlugin);
module.exports = mongoose.model('Job', jobSchema);