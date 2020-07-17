import React, { useState, useEffect } from 'react'
import { ToggleButton, Container, Row, Col } from 'react-bootstrap'
import MathJax from 'react-mathjax-preview'

export default function Studentanswer({ options, choosenAnswer }) {

  

  const [radioValue, setRadioValue] = useState('0');
  const radios = [
    { name: <MathJax math={'$$' + options.optionA + '$$'} />, value: '1' },
    { name: <MathJax math={'$$' + options.optionB + '$$'} />, value: '2' },
    { name: <MathJax math={'$$' + options.optionC + '$$'} />, value: '3' },
    { name: <MathJax math={'$$' + options.optionD + '$$'} />, value: '4' },
  ];

  useEffect(() => {
    choosenAnswer(radioValue)
  }, [radioValue])

  return (
    <Container style={{ "minHeight": "auto" }} >
      <h3 style={{ "margin": "1rem" }}>Select Your Option : </h3>
      <Row className="justify-content-md-center justify-content-lg-center justify-content-sm-center">
        {radios.map((radio, idx) => (
          <Col xs={12} sm={12} md={3} lg={3} key={idx}>
            <ToggleButton
              key={idx}
              type="radio"
              variant="outline-success"
              name="radio"
              value={radio.value}
              style={{
                "display": "block",
                "marginLeft": "auto",
                "marginRight": "auto"
              }}
              onChange={(e) => setRadioValue(e.currentTarget.value)}
            >
              {radio.name}
            </ToggleButton>
          </Col>
        ))}
      </Row>
      {radioValue === "0" ? <div style={{ "margin": "20px" }}>None Selected</div> : <div style={{ "margin": "20px" }}>Option {radioValue} saved</div>}
    </Container>
  );
}