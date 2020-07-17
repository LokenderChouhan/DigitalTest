const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// create details Schema & model
const studentrecordSchema = new Schema({
    username: {
        type: String,
        required: [true, 'Field is required']
    },
    answers : { type : Array , "default" : [] },
    testCompleted: {
        type: Boolean,
        default: false
    },
    available: {
        type: Boolean,
        default: false
    },
    password: {
        type: String,
        default: null,
        required: [true, 'Field is required']
    }
});

const studentRecords = mongoose.model('student', studentrecordSchema);

module.exports = studentRecords;
