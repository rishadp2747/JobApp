const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/jobs', {useNewUrlParser: true, useUnifiedTopology: true});

const JobSchema = new mongoose.Schema({
    id : {
        type : String, 
        required : true
    },
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
        timestamps : true,
        required : true
    },
    date_to : {
        type : Date,
        timestamps : true,
        required : true
    },
    time_from : {
        type : Date,
        timestamps : true,
        required : true
    },
    time_to : {
        type : Date,
        timestamps : true,
        required : true
    },
    skill : {
        type: Schema.Types.ObjectId,
        ref: 'Skills' 
    },
    status : {
        type: String,
        enum : [active, pending, commit, completed, rejected],
        default: 'active'
    },
    posted_by : { 
        type: Schema.Types.ObjectId,
        ref: 'Users' 
    },
    commited_by : { 
        type: Schema.Types.ObjectId, 
        ref: 'Users' 
    },
    requests : [{ 
        type : Schema.Types.ObjectId, 
        ref: 'User' 
    }],
    created_at : {
        type : Date,
        timestamps : true
    },
    updated_at :{
        type : Date,
        timestamps : true
    }

});

module.exports = require('Job',JobSchema);