const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// create details Schema & model
const teacherRecordSchema = new Schema({
    username: {
        type: String,
        required: [true, 'Field is required']
    },
    // question:{
    //     type:String,
    //     default:""
    // },
    // optionA:{
    //     type:String,
    //     default:""
    // },
    // optionB:{
    //     type:String,
    //     default:""
    // },
    // optionC:{
    //     type:String,
    //     default:""
    // },
    // optionD:{
    //     type:String,
    //     default:""
    // },
    // answer:{
    //     type:String,
    //     default:""
    // },
    question:{ 
        ques : String,
        optionA : String,
        optionB : String,
        optionC : String,
        optionD : String,
        answer : String
     },
    subject:{
        type:String,
        default: null,
        required: [true, 'Field is required']
    },
    password: {
        type: String,
        default: null,
        required: [true, 'Field is required']
    }
});

const teacherRecords = mongoose.model('teacher', teacherRecordSchema);

module.exports = teacherRecords;
