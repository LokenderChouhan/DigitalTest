import React, { useState} from 'react'
import axios from 'axios'
import SubjectList from './subjects_list';

import { Button, Alert} from 'react-bootstrap';

export default function Student() {

  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  const [SignIn, setSignIn] = useState(true);
  const [msg, setMsg] = useState("")
  const [userValidation, setUserValidation] = useState(false);

  const user = {
    username,
    password,
  };

  let handleSignUp = (e) => {
    e.preventDefault();
    axios
      .post('/registerStudent', user)
      .then((res) => {setUserValidation(res.data);
        if (res.data === false) {
          setMsg("User Already Exists..Log In to continue"); 
          setUsername("");
          setPassword("");
          setTimeout(() => {
            setMsg("")
          }, 2000)
        }
      })
      .catch(err => {
        console.error(err);
      });
  }
  // setUserValidation(res.data);

  let handleSignIn = (e) => {
    e.preventDefault();
    axios
      .post('/validateStudent', user)
      .then((res) => {
        setUserValidation(res.data); if (res.data === false) {
          setMsg("Wrong Entries "); setUsername("");
          setPassword("");
          setTimeout(() => {
            setMsg("")
          }, 2000)
        }
      })
      .catch(err => {
        console.error(err);
      });
  }

  return (
    <div style={{
        "padding": "0 0.5rem",
        "display": "flex",
        "flexDirection": "column",
        "justifyContent": "center",
        "alignItems": "center"
      }}>
      {SignIn && !userValidation && <>
        <p className="description">
          Sign In ... <code >as a Student</code>
        </p>

        {msg !== "" && <Alert variant="danger"> {msg} </Alert>}
        <form onSubmit={handleSignIn}>
          <div className="grid">
            <label href="#" className="card" >
              <h3>Username : </h3>
              <input type="text" placeholder={"Enter Username"} value={username} name="username" onChange={e => { setUsername(e.target.value) }} required />
            </label>
            <label href="#" className="card" >
              <h3>Password : </h3>
              <input type="password" placeholder={"Enter Password"} value={password} name="password" onChange={e => { setPassword(e.target.value) }} required />
            </label>
            <input className="submit" type="submit" value="Submit" />
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
          </div>
        </form>
          <Button variant="link" style={{ "margin": "2rem" }} onClick={() => setSignIn(false)}>New User?..SignUp</Button>
          <Button href="/" variant="primary">Home</Button>{'   '}

      </>}
      {!SignIn && !userValidation && <>
        <p className="description">
          Register ... <code >as a Student</code>
        </p>

        {msg !== "" && <Alert variant="danger"> {msg} </Alert>}

        <form onSubmit={handleSignUp}>
          <div className="grid">
            <label href="#" className="card" >
              <h3>Username : </h3>
              <input type="text" placeholder={"Enter Username"} value={username} name="username" onChange={e => setUsername(e.target.value)} required />
            </label>
            <label href="#" className="card" >
              <h3>Password : </h3>
              <input type="password" placeholder={"Enter Password"} value={password} name="password" onChange={e => setPassword(e.target.value)} required />
            </label>
            <input className="submit" type="submit" value="Submit" />
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
          </div>
        </form>
        <Button variant="link" style={{ "margin": "2rem" }} onClick={() => setSignIn(true)}>LogIn</Button>
        <Button href="/" variant="primary">Home</Button>{'   '}
      </>}

      {userValidation &&
        <>
          <SubjectList username={username} />

          <Button href="/" variant="danger" onClick={() => setUserValidation(false)}>LogOut</Button>
        </>
      }
    </div>

  )

}