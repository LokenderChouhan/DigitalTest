const express = require('express');
const TeacherRecords = require('../models/teacherrecords');
const StudentRecords = require('../models/studentrecords');
fs = require('fs');

const router = express.Router();

router.get('/allsubjects', function (req, res, next) {
    let teacher_subjects= [];
    //get all subjects and respective answers if question exists for a subject
    TeacherRecords.find({}).then(function (teachers) {
        teachers.map(function (teacher) {
            if (teacher.question.answer){
                teacher_subjects.push({ "Subject": teacher.subject} )
            }
        });
        res.send(teacher_subjects)
    })
})

router.get('/allstudents', function (req, res, next) {
    let teacher_subjects_ans = [];
    //get all subjects and respective answers if question exists for a subject
    TeacherRecords.find({}).then(function (teachers) {
        teachers.map(function (teacher) {
            if (teacher.question.answer) {
                teacher_subjects_ans.push({ "Subject": teacher.subject, "Answer": teacher.question.answer ? teacher.question.answer : "" })
            }
        })
        //res.send(teacher_subjects_ans)
    });
    //get all students 
    StudentRecords.find({}).then(function (students) {

        let filterstudentrecords = students.map(function (student) {
            
            let subjects_submitted = [];
            //calculate results for subjects student has given tests
            let Subjectwise_result = student.answers.map((answer) => {
                let Subject, Result, Correct_Option;
                //to calculate result (Correct/wrong)
                for (var x in teacher_subjects_ans) {
                    if (teacher_subjects_ans[x].Subject === answer.subject) {
                        //flag = 1;

                        Subject = teacher_subjects_ans[x].Subject;
                        Result = teacher_subjects_ans[x].Answer === answer.values.option ? "Correct" : "Wrong";
                        Correct_Option = teacher_subjects_ans[x].Answer

                        subjects_submitted.push(Subject);
                    }
                }
                return ({
                    "Subject": Subject,
                    "Result": Result,
                    "Option_Selected": answer.values.option,
                    "Correct_Option": Correct_Option,
                    "Audio": answer.values.audio_Url !== "" ? fs.readFileSync(answer.values.audio_Url, 'utf8') : "Not Submited",
                    "Calculation": answer.values.calc_Url !== "" ? fs.readFileSync(answer.values.calc_Url, 'utf8') : "Not Submited",
                })
            })
            for (var x in teacher_subjects_ans) {
                let flag = 0;
                for (var y in subjects_submitted) {
                    if (teacher_subjects_ans[x].Subject === subjects_submitted[y]) flag = 1;
                }
                if (flag === 0) {
                    Subjectwise_result.push({
                        "Subject": teacher_subjects_ans[x].Subject,
                        "Result": "---",
                        "Option_Selected": "---",
                        "Correct_Option": teacher_subjects_ans[x].Answer,
                        "Audio": "---",
                        "Calculation": "---",
                    })
                }
            }
            //remaining subjects left
            return ({
                "Name": student.username,
                "Subjectwise_result": Subjectwise_result
            })
        });
        res.send(filterstudentrecords);
    });

});

// req.body{username,password}, returns bool true/false
router.post('/registerStudent', function (req, res, next) {
    StudentRecords.countDocuments({ "username": req.body.username }, function (err, count) {
        if (count === 0) {
            StudentRecords.create(req.body).then(function (newStudent) {
                res.send(true);
            }).catch(next)
        }
        else {
            res.send(false)
        }
    });
});

// req.body{username,password}, returns bool true/false
router.post('/validateStudent', function (req, res, next) {
    StudentRecords.find({ "username": req.body.username, "password": req.body.password }, function (err, docs) {
        if (docs.length > 0) {
            res.send(true)
            console.log(docs);
        }
        else res.send(false);
    }).catch(next);
});

// req.body{username,password}, returns bool true/false
router.post('/validateTeacher', function (req, res, next) {
    TeacherRecords.find({ "username": req.body.username, "password": req.body.password }, function (err, docs) {
        if (docs.length >= 1) {
            res.send(true)
            console.log(docs);
        }
        else res.send(false);
    }).catch(next);
});

// req.body{subject,username,password}, returns bool true/false
router.post('/registerTeacher', function (req, res, next) {
    TeacherRecords.countDocuments({ "username": req.body.username }, function (err, count) {
        if (count === 0) {
            TeacherRecords.create(req.body).then(function (newStudent) {
                res.send(true);
            }).catch(next)
        }
        else {
            res.send(false)
        }
    });
});

//provide username in params, req.body{subject,calc,audio,option} ,returns("Anser Saved")
router.put('/addstudentanswer/:username', function (req, res, next) {

    let Calc_path = './data/' + req.params.username + "_"+req.body.subject+'_Calc.txt';
    fs.writeFile(Calc_path, req.body.calc, function (err) {
        if (err) return console.log(err);
        console.log('Calc file saved');
    });

    let Audio_path = './data/' + req.params.username + "_"+req.body.subject+'_Audio.txt';
    fs.writeFile(Audio_path, req.body.audio, function (err) {
        if (err) return console.log(err);
        console.log('Audio file Saved');
    });

    StudentRecords.find({username:req.params.username},function(err,docs){
        let answers_arr = docs[0].answers
        let present_record = false;

        //check if subject answer already present
        for (answer_arr_item of answers_arr) {
            if(answer_arr_item.subject===req.body.subject){
                console.log("found1")
                present_record = true;
            }
        }

        if (present_record === false) {
            StudentRecords.update({ 'username': req.params.username },
                {
                    $push: {
                        answers: [{
                            "subject": req.body.subject,
                            'values': {
                                'audio_Url': Audio_path,
                                'calc_Url': Calc_path,
                                "option": req.body.option
                            }
                        }]
                    }
                },function (err, company) {
                    console.log(company)
                });
            res.send("Answer Saved")
        }

        else{
            res.send("Test Already Completed");
        }

    })
});

//provide username in params, req.body{question,optionA,optionB,optionC,optionD,answer},returns("Question Saved")
router.put('/addteacher_question_options_answer/:username', function (req, res, next) {
    TeacherRecords.update({ 'username': req.params.username },
        {
            $set: {
                question: {
                    "ques": req.body.question,
                    "optionA": req.body.optionA,
                    "optionB": req.body.optionB,
                    "optionC": req.body.optionC,
                    "optionD": req.body.optionD,
                    "answer":  req.body.answer,
                }
            }
        },function (err, company) {
            console.log(company)
        })
    res.send("Question Saved")
});

//provide subject in params, returns{question,optionA,optionB,optionC,optionD,answer}
router.get('/getquestion/:subject',function(req,res,next){
    TeacherRecords.find({"subject":req.params.subject}).then(function (teacher) {
        res.send({
            question : teacher[0].question.ques,
            optionA : teacher[0].question.optionA,
            optionB : teacher[0].question.optionB,
            optionC : teacher[0].question.optionC,
            optionD : teacher[0].question.optionD,
            answer : teacher[0].question.answer,
        })
    }).catch(next);
})

module.exports = router;
