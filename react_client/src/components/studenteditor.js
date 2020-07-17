import React, { useEffect, useState} from 'react';
import * as MyScriptJS from 'myscript'
import { Navbar, Button} from 'react-bootstrap'
import katex from 'katex'

import 'katex/dist/katex.min.css';

// import Latex from 'react-latex'
import 'myscript/dist/myscript.min.css';

const editorStyle = {
    'minWidth': '100px',
    'minHeight': '100px',
    'width': '90vw',
    'height': '80vh',
    'touchAction': 'none',
    'background': '#c5e3f6',
    "margin":"2rem",
    "borderRadius":"0.5rem"
};

export default function Studenteditor({calculation}) {


    const [latexoutput, setlatexOutput] = useState("")

    const uploadstudentcalc = () =>{
        calculation(latexoutput) 
        document.getElementById("Response").innerHTML = "Saved"
    }

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
                setlatexOutput(exports['application/x-latex'])
                try {
                    katex.render(cleanLatex(exports['application/x-latex']), resultElement);
                } catch(e) {console.log(e)}
            } else if (exports && exports['application/mathml+xml']) {
                convertElement.disabled = false;resultElement.innerText = exports['application/mathml+xml'];
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
            <h2>Do your Calculation Here</h2>
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
                            <img src={require("../assets/redo.svg")} alt="Redo"/>
                        </button>
                    </div>
                    <div className="spacer"></div>
                    <button className="classic-btn" id="convert" disabled>Convert</button>
                </Navbar>
                <div style={editorStyle} id="editor" ></div>
                <div id="Response"></div>
                <Button variant="success"style={{"margin":"2rem"}}  onClick={uploadstudentcalc}>Save Calculation</Button>{' '}
            </>
            </div>
    )
}
