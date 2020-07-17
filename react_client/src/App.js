import React, { useState} from 'react';
import Teacher from './components/teacher';
import Student from './components/student';
import './assets/App.css'
export default function App() {

  const [user, setUser] = useState(null);
  let UserToStudent = () => {
    setUser("student")
  };

  let UserToTeacher = () => {
    setUser("teacher")
  };

    return (
      <div style={{
        "padding": "0 0.5rem",
        "display": "flex",
        "flexDirection": "column",
        "justifyContent": "center",
        "alignItems": "center"
      }}>
          <h1 className="title" style={{"margin":"1rem"}} >
            Welcome to DigiClass
          </h1>
          {
              user == null &&
              <>
                <p className="description">
                  Enter ... <code>Select user from Below</code>
                </p>
                <div className="grid">
                <div style={{"flexDirection":"row"}}>
                    <a href="#" style={{ "textDecoration": "none" }} className="card" onClick={UserToStudent}>
                      <h3>Student &rarr;</h3>
                      <p>Enter to submit Tests</p>
                    </a>
                    <a href="#" style={{ "textDecoration": "none" }} className="card" onClick={UserToTeacher}>
                      <h3>Teacher &rarr;</h3>
                      <p>See Reports</p>
                    </a>
                  </div>
                </div>
              </>
          }
          {
            user === "student" && <Student />
          }
          {
            user === "teacher" && <Teacher />
          }
        
        <footer>
          <a
            href="https://github.com/LokenderChouhan/DigitalTest"
            target="_blank"
            rel="noopener noreferrer"
          >
            Created by Lokender Chouhan <img style={{width:"20px",height:"20px"}} src={require('./assets/logo.png')}/>
          </a>
        </footer>
    </div>
    )
  } 

