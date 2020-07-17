import React, { useState, useEffect } from "react"
import {Button} from 'react-bootstrap'

//------------------------SPEECH RECOGNITION-----------------------------

var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
var recognition = new SpeechRecognition;

recognition.continous = true
recognition.interimResults = true
recognition.lang = 'en-US'


//------------------------COMPONENT-----------------------------

//  Speech extends Component {
export default function Speechtotext({audio}) {
    const [listening, setListening] = useState(false);
    const [inputtext,setInputtext] = useState("");
    const [outputtext,setOutputtext] = useState("");
    const [mic,setMic] = useState(false);

    const toggleListen = () => {
        
        setListening(!listening)
    }

    useEffect(() => {
        if (listening) {
            setMic(true)
            recognition.start()
            recognition.onend = () => {
                recognition.start()
            }

        } else {
            setMic(false)
            recognition.stop()
            recognition.onend = () => {
                
            }
        }

        recognition.onstart = () => {
        }

        let finalTranscript = ''
        recognition.onresult = event => {
            let interimTranscript = ''

            for (let i = event.resultIndex; i < event.results.length; i++) {
                const transcript = event.results[i][0].transcript;
                if (event.results[i].isFinal) finalTranscript += transcript + ' ';
                else interimTranscript += transcript;
            }
            setInputtext(...inputtext,finalTranscript)
            document.getElementById('interim').innerHTML = interimTranscript
            document.getElementById('final').innerHTML = finalTranscript

            //-------------------------COMMANDS------------------------------------

            const transcriptArr = finalTranscript.split(' ')
            const stopCmd = transcriptArr.slice(-3, -1)

            if (stopCmd[0] === 'stop' && stopCmd[1] === 'listening') {
                recognition.stop()
                recognition.onend = () => {
                    let finalText = transcriptArr.slice(0, -3).join(' ');
                    setInputtext(...inputtext,finalText);
                    document.getElementById('final').innerHTML = finalText;
                    setMic(false);
                }
            }
        }

        //-----------------------------------------------------------------------

        recognition.onerror = event => {
            console.log("Error occurred in recognition: " + event.error)
        }

    }, [listening])

    const deleteInputtext = ()=>{
        setInputtext('');
        setListening(false);
    }

    const addtofile = () => {
        setListening(false)
        let div = inputtext; //document.getElementById('final').innerHTML
        let newtext = outputtext +' '+ div;
        setOutputtext(newtext);
        setInputtext('');
    }

    const uploadfile = (e) => {
        if (outputtext !== "") {
            audio(outputtext)
            document.getElementById('response').innerHTML = "Saved"
            setTimeout(() => {
                document.getElementById('response').innerHTML = ""
            }, 2000)
        }
        else{
            document.getElementById('response').innerHTML = "Nothing to Save !!!"
            setTimeout(() => {
                document.getElementById('response').innerHTML = ""
            }, 2000)
        }

    }
    const Msg = () =>{
        return(
        <>
        {
            !mic && <p>Press to record audio</p>
        }
        {
            mic && <p>Press or Say "STOP LISTENING" to record audio</p>
        }

        </>)
    }

    return (
            <div style={container}>
                <h2>Explain your Solution</h2>
                <a  style={{"textDecoration": "none"}} onClick={toggleListen}>
                    <img style={button} src={mic ? require('../assets/micon.png') : require('../assets/micoff.png')}  alt="MicOn/Off"/>
                    <Msg/>
                </a>
                <div id='interim' style={interim}></div>
                <div id='final'style={{...final,"display":"none",}}></div>
                <h3>Interpreted Text (Add to Final Output)</h3>
                <div style={final}>{inputtext}</div>
                <Button variant="outline-danger" style={{"margin": "0.5rem"}} onClick={deleteInputtext}>Clear Interpreted Text</Button>
                <h3>Final Output state</h3>
                <div style={final}>{outputtext}</div>
                <Button variant="outline-primary" style={{"margin": "0.5rem"}} onClick={addtofile}>Add to Final Output</Button>{' '}
                <div id='response' style={{...interim,"display":"block","margin": "0.5rem"}}></div>

                <Button variant="success" style={{"margin": "1rem"}} onClick={uploadfile}>Save Ouput</Button>
            </div>
    )
}


//-------------------------CSS------------------------------------

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center'
    },
    button: {
        width: '60px',
        height: '60px'
    },
    interim: {
        height:'2em',
        color: 'gray',
        padding: '1em',
        margin: '1em',
        width: '300px'
    },
    final: {
        
        color: 'black',
        border: '#ccc 1px solid',
        padding: '1em',
        margin: '1em',
        width: '300px'
    }
}

const { container, button, interim, final } = styles
