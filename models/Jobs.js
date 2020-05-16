const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
    
    id : {
        type : String, 
        required : true
        
    },
    title : {
        type : String
        
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
        type : Date, 
        required : true
        
    },
    time_to : {
        type : Date, 
        required : true
        
    },
    skill : { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Skill'
    },
    status : {
        type: String,
        enum : [active, pending, commit, completed, rejected],
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
    }],
    
},{
    timestamps : true
});

module.exports = require('Job',JobSchema);