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
        ref: 'Skill'
    },
    status : {
        type: String,
        enum : ['active', 'pending', 'commit', 'completed', 'rejected'],
        default: 'active'
    },
    postedBy : {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' 
    },
    commitedBy : { 
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


module.exports = mongoose.model('Job', jobSchema);