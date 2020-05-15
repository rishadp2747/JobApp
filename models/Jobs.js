const mongoose = require('mongoose');

mongoose.set('useCreateIndex', true)
mongoose.connect('mongodb://localhost:27017/jobs', {useNewUrlParser: true, useUnifiedTopology: true});

const JobSchema = new mongoose.Schema({
    id : {type : String, required : true},
    title : {type : String},
    description : {type : String, required : true},
    date_from : {type : Date},
    date_to : {type : Date},
    time_from : {type : Date},
    time_to : {type : Date},
    skill : { type: Schema.Types.ObjectId, ref: 'Skills' },
    status : {
        type: String,
        enum : [active, pending, commit, completed, rejected],
        default: 'active'
    }    
    ,
    posted_by : { type: Schema.Types.ObjectId, ref: 'Users' },
    commited_by : { type: Schema.Types.ObjectId, ref: 'Users' },
    requests : [{ type : Schema.Types.ObjectId, ref: 'User' }],
    created_at : {type : Date},
    updated_at :{type : Date}

});

module.exports = require('Jobs',JobSchema);