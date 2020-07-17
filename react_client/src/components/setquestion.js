import React, { useEffect, useState} from 'react';
import axios from 'axios'
import * as MyScriptJS from 'myscript'
import katex from 'katex'
import { Navbar, ButtonGroup, ToggleButton, Button ,Alert} from 'react-bootstrap'

import 'katex/dist/katex.min.css';
import 'myscript/dist/myscript.min.css';

const editorStyle = {
    'minWidth': '100px',
    'minHeight': '100px',
    'width': '90vw',
    'height': '50vh',
    'touchAction': 'none',
    'background': 'powderblue',
    "borderRadius":"0.5rem"
};

export default function Setquestion({username}) {

    const [q, setQ] = useState("");
    const [ques,setQues] = useState("")
    const [op_a, setOp_a] = useState("");
    const [op_b, setOp_b] = useState("");
    const [op_c, setOp_c] = useState("");
    const [op_d, setOp_d] = useState("");
    const [cur, setCur] = useState("q");
    const [ans,setAns] = useState("0");
    const [editorname,setEditorname] = useState("");
    const [msg,setMsg] = useState("");
    const radios = [
        { name: 'Question', value: 'q' },
        { name: 'Option a', value: 'op_a' },
        { name: 'Option b', value: 'op_b' },
        { name: 'Option c', value: 'op_c' },
        { name: 'Option d', value: 'op_d' },
    ];
    const anslist = [
        { name: 'Option a', value: '1' },
        { name: 'Option b', value: '2' },
        { name: 'Option c', value: '3' },
        { name: 'Option d', value: '4' },
    ];

    const submitQues = () =>{
        if(q===""){
            setMsg("Enter Question !!!");
        }
        else if(op_a===""){
            setMsg("Enter Option A !!!");
        }
        else if(op_b===""){
            setMsg("Enter Option B !!!");
        }
        else if(op_c===""){
            setMsg("Enter Option C !!!");
        }
        else if(op_d===""){
            setMsg("Enter Option D !!!");
        }
        else if(ans==="0"){
            setMsg("Select correct Answer/Option !!!");
        }
        else{
            axios
                .put('/addteacher_question_options_answer/'+username,{"question":ques,"optionA":op_a,"optionB":op_b,"optionC":op_c,"optionD":op_d,"answer":ans})
                .then((res) => {setMsg(res.data)})
                .catch(err => {
                    alert(err);
                });
        }
    }

    const upload = () => {
        document.getElementById('response').innerHTML = "Saved"
        setTimeout(()=>{
            document.getElementById('response').innerHTML = ""
        },1500)

    }

    useEffect(() => {
        switch (cur) {
            case "q": setEditorname("Question"); break;
            case "op_a": setEditorname("Option a"); break;
            case "op_b": setEditorname("Option b"); break;
            case "op_c": setEditorname("Option c"); break;
            case "op_d": setEditorname("Option d"); break;
            default: { }
        }
    }, [cur])
  
    useEffect(() => {
        if(cur==="q") {setQues(q)}
        if (cur === "op_a") { setOp_a(q); }
        if (cur === "op_b") { setOp_b(q);}
        if (cur === "op_c") { setOp_c(q);}
        if (cur === "op_d") { setOp_d(q);}
    }, [q])

    useEffect(() => {
        var editorElement = document.getElementById('editor');
        var resultElement = document.getElementById('result');
        var undoElement = document.getElementById('undo');
        var redoElement = document.getElementById('redo');
        var clearElement = document.getElementById('clear');
        var convertElement = document.getElementById('convert');

        editorElement.addEventListener('changed', function (event) {
            undoElement.disabled = !event.detail.canUndo;
            redoElement.disabled = !event.detail.canRedo;
            clearElement.disabled = event.detail.isEmpty;
        });

        function cleanLatex(latexExport) {
            if (latexExport.includes('\\\\')) {
                const steps = '\\begin{align*}' + latexExport + '\\end{align*}';
                return steps.replace("\\overrightarrow", "\\vec")
                    .replace("\\begin{aligned}", "")
                    .replace("\\end{aligned}", "")
                    .replace("\\llbracket", "\\lbracket")
                    .replace("\\rrbracket", "\\rbracket")
                    .replace("\\widehat", "\\hat")
                    .replace(new RegExp("(align.{1})", "g"), "aligned");
            }
            return latexExport
                .replace("\\overrightarrow", "\\vec")
                .replace("\\llbracket", "\\lbracket")
                .replace("\\rrbracket", "\\rbracket")
                .replace("\\widehat", "\\hat")
                .replace(new RegExp("(align.{1})", "g"), "aligned");
        }

        editorElement.addEventListener('exported', function (evt) {

            const exports = evt.detail.exports;
            if (exports && exports['application/x-latex']) {
                convertElement.disabled = false;

                if(cur==="op_a") { setOp_a(q);}
                    if(cur==="q") { setQ(exports['application/x-latex']);}
                    if(cur==="op_b") { setOp_b(q);}
                    if(cur==="op_c") { setOp_c(q);}
                    if(cur==="op_d") { setOp_d(q);}

                try {
                    katex.render(cleanLatex(exports['application/x-latex']), resultElement);
                } catch(e) {}
                

            } else if (exports && exports['application/mathml+xml']) {
                convertElement.disabled = false;
                resultElement.innerText = exports['application/mathml+xml'];
            } else if (exports && exports['application/mathofficeXML']) {
                convertElement.disabled = false;
                resultElement.innerText = exports['application/mathofficeXML'];
            } else {
                convertElement.disabled = true;
                resultElement.innerHTML = '';
            }
        });

        undoElement.addEventListener('click', function () {
            editorElement.editor.undo();
        });
        redoElement.addEventListener('click', function () {
            editorElement.editor.redo();
        });
        clearElement.addEventListener('click', function () {
            editorElement.editor.clear();
        });
        convertElement.addEventListener('click', function () {
            editorElement.editor.convert();
        });

        MyScriptJS.register(editorElement, {
            recognitionParams: {
                type: 'MATH',
                protocol: 'WEBSOCKET',
                apiVersion: 'V4',
                server: {
                    scheme: 'https',
                    host: 'webdemoapi.myscript.com',
                    applicationKey: '515131ab-35fa-411c-bb4d-3917e00faf60',
                    hmacKey: '54b2ca8a-6752-469d-87dd-553bb450e9ad'
                },
                v4: {
                    math: {
                        mimeTypes: ['application/x-latex', 'application/vnd.myscript.jiix']
                    },
                    export: {
                        jiix: {
                            strokes: true
                        }
                    }
                }
            }
        });

        window.addEventListener("resize", () => { editorElement.editor.resize(); });
    }, [])

    return (
        <div style={{"padding": "0 0.5rem",
  "display": "flex",
  "flexDirection": "column",
  "justifyContent": "center",
  "alignItems": "center"}}>
        <h2 style={{"margin" : "2rem"}}>Input Question and Set Multiple Choice Options </h2>
            <ButtonGroup toggle>
                {radios.map((radio, idx) => (
                    <ToggleButton
                        key={idx}
                        type="radio"
                        variant="outline-primary"
                        name="radio"
                        value={radio.value}
                        checked={cur === radio.value}
                        onChange={(e) => setCur(e.currentTarget.value)}
                    >
                        {radio.name}
                    </ToggleButton>
                ))}
            </ButtonGroup>
                
            
            <div id="result"></div>
            <>
                <Navbar>
                    <div className="button-div">
                        <button id="clear" className="nav-btn btn-fab-mini btn-lightBlue" disabled>
                            <img src={require("../assets/clear.svg")} alt="Clear"/>
                        </button>
                        <button id="undo" className="nav-btn btn-fab-mini btn-lightBlue" disabled>
                            <img src={require("../assets/undo.svg")} alt="Undo"/>
                        </button>
                        <button id="redo" className="nav-btn btn-fab-mini btn-lightBlue" disabled>
                            <img src={require("../assets/redo.svg")} alt="Redo" />
                        </button>
                    </div>
                    <div className="spacer"></div>
                    <button className="classic-btn" id="convert" disabled>Convert</button>
                </Navbar>
                <div style={editorStyle} id="editor" ></div>
                <div id='response'></div> 
                    
                <Button style={{"margin" : "2rem"}} variant="success" onClick={upload}>
                    Save {editorname}
                </Button>{' '}

                <h2 style={{"margin" : "2rem"}}>Select Correct Answer : </h2>
                <ButtonGroup toggle>
                    {anslist.map((anslist, idx) => (
                        <ToggleButton
                            key={idx}
                            type="radio"
                            variant="outline-secondary"
                            name="radio"
                            value={anslist.value}
                            checked={ans === anslist.value}
                            onChange={(e) => setAns(e.currentTarget.value)}
                        >
                            {anslist.name}
                        </ToggleButton>
                    ))}
                    
                </ButtonGroup>
                {ans==="0"?<div style={{"margin" : "20px"}}>None Selected</div>:<div style={{"margin" : "20px"}}>Option {ans} saved as correct answer</div>}

                {msg !== "" && <Alert variant="danger" > {msg} </Alert>}
                <Button variant="primary" style={{ "margin": "1rem" }} onClick={submitQues}>Submit Question</Button>                
            </>
        </div>
    )
}
