import React, { useState, useEffect } from 'react'
import axios from 'axios'
import SpeechToText from './speechtotext'
import StudentEditor from './studenteditor';
import StudentAnswer from './studentanswer';
import ShowQuestion from './showQuestion';
import { Button, Alert } from 'react-bootstrap';

export default function Subjects_list({username}) {

    const [subjects, setSubjects] = useState([]);
    const [choosenSubject, setChoosenSubject] = useState("");

    const [question, setQuestion] = useState("");
    const [audio,setAudio] = useState("");
    const [options,setOptions] = useState({});
    const [choosenAnswer,setChoosenAnswer] = useState("");
    const [calculation,setCalculation] = useState("");

    const [msg,setMsg] = useState("");

    const StudenttoSubject = (subjectName) => {
        setChoosenSubject(subjectName);
        axios
            .get('/getquestion/' + subjectName)
            .then((res) => { 
                setQuestion(res.data.question); 
                setOptions({
                    optionA:res.data.optionA,
                    optionB:res.data.optionB,
                    optionC:res.data.optionC,
                    optionD:res.data.optionD,})
            })
            .catch(err => {
                console.error(err);
            });
    }

    const submitTest = () =>{
      if(choosenAnswer==="0"){
        setMsg("Choose an option")
      }
      else if(audio===""){
        setMsg("Submit Audio")
      }
      else if(calculation===""){
        setMsg("Submit Calculation")
      }
      else
      {
        axios
            .put('/addstudentanswer/'+username,{"subject":choosenSubject,"calc":calculation,"audio" : audio,"option":choosenAnswer})
            .then((res) => { setMsg(res.data) })
            .catch(err => {
                console.error(err);
        });
      }
    }

    useEffect(() => {
        axios
            .get('/allsubjects')
            .then((res) => { setSubjects(res.data) })
            .catch(err => {
                console.error(err);
            });
    })

    if (choosenSubject === "")
        return (
            <>
                <p className="description">
                    Enter ... <code>Select Subject from Below</code>
                </p>

                <div className="grid">
                    {subjects.map((subject,index) => {
                        return (
                            <a key={index} href="#" style={{ "textDecoration": "none" }} className="card" onClick={() => { StudenttoSubject(subject.Subject) }}>
                                <h3>{subject.Subject} &rarr;</h3>
                            </a>
                        );
                    })}
                </div>
                <style jsx="true">
                    {`
            .container {
              min-height: 100vh;
              padding: 0 0.5rem;
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
            }
            input{

            }
            main {
              padding: 5rem 0;
              flex: 1;
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
            }

            footer {
              width: 100%;
              height: 100px;
              border-top: 1px solid #eaeaea;
              display: flex;
              justify-content: center;
              align-items: center;
            }

            footer img {
              margin-left: 0.5rem;
            }

            footer a {
              display: flex;
              justify-content: center;
              align-items: center;
            }

            a {
              color: inherit;
              text-decoration: none;
            }

            .title a {
              color: #0070f3;
              text-decoration: none;
            }

            .title a:hover,
            .title a:focus,
            .title a:active {
              text-decoration: underline;
            }

            .title {
              margin: 0;
              line-height: 1.15;
              font-size: 4rem;
            }

            .title,
            .description {
              text-align: center;
            }

            .description {
              line-height: 1.5;
              font-size: 1.5rem;
            }

            code{
              background: #fafafa;
              border-radius: 5px;
              padding: 0.75rem;
              font-size: 1.1rem;
              font-family: Menlo, Monaco, Lucida Console, Liberation Mono,
                DejaVu Sans Mono, Bitstream Vera Sans Mono, Courier New, monospace;
            }

            .grid {
              display: flex;
              align-items: center;
              justify-content: center;
              flex-wrap: wrap;

              max-width: 800px;
              margin-top: 3rem;
            }

            .card{
              margin: 1rem;
              flex-basis: 45%;
              padding: 1.5rem;
              text-align: left;
              color: inherit;
              text-decoration: none;
              border: 1px solid #eaeaea;
              border-radius: 10px;
              transition: color 0.15s ease, border-color 0.15s ease;
            }
            input {
              padding: 0.8rem;
              text-align: center;
              color: inherit;
              text-decoration: none;
              border: 1px solid #eaeaea;
              border-radius: 10px;
              transition: color 0.15s ease, border-color 0.15s ease;
            }

            .submit:hover,
            .submit:focus,
            .submit:active {
              color: #0070f3;
              border-color: #0070f3;
            }

            .card:hover,
            .card:focus,
            .card:active {
              color: #0070f3;
              border-color: #0070f3;
            }

            .card h3 {
              margin: 0 0 1rem 0;
              font-size: 1.5rem;
            }

            .card p {
              margin: 0;
              font-size: 1.25rem;
              line-height: 1.5;
            }

            .logo {
              height: 1em;
            }

            @media (max-width: 600px) {
              .grid {
                width: 100%;
                flex-direction: column;
              }
            }
            `}
                </style>
                <style jsx="true" global="true">
                    {`
            html,
            body {
              padding: 0;
              margin: 0;
              font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
                Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
                sans-serif;
            }

            * {
              box-sizing: border-box;
            }
         `}
                </style>
            </>
        )
    else {
        return (
            <>
            <ShowQuestion question={question} />
            <StudentEditor calculation={setCalculation}/>
            <SpeechToText audio={setAudio} />
            <StudentAnswer options={options} choosenAnswer={setChoosenAnswer}/>
            {msg!=="" && <Alert variant="danger" > {msg} </Alert>}
            <Button variant="primary" style={{"margin": "1rem"}} onClick={submitTest}>Submit Test</Button>
            <Button variant="outline-primary" style={{"margin": "1rem"}} onClick={()=>{setChoosenSubject("")}}>Go Back</Button>
            </>
        )
    }
}
