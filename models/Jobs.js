const mongoose = require('mongoose');
const Schema  = mongoose.Schema;


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

const JobSchema = new Schema({

    title : {
        type : String,
        required : true
        
    },
    description : {
        type : String, 
        required : true
        
    },
    date_from : {
        type : Date, 
        required : true
        
    },
    date_to : {
        type : Date, 
        required : true
        
    },
    time_from : {
        type : TimeSchema, 
        required : true
        
    },
    time_to : {
        type : TimeSchema, 
        required : true
        
    },
    skill : { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Skill'
    },
    status : {
        type: String,
        enum : ['active', 'pending', 'commit', 'completed', 'rejected'],
        default: 'active'
    },
    posted_by : {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' 
    },
    commited_by : { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User' 
    },
    requests : [{ 
        type : mongoose.Schema.Types.ObjectId,
        ref: 'User' 
    }]
    
},{
    timestamps : true
});

module.exports = mongoose.model('Job', JobSchema);