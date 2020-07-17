import React from 'react'
import MathJax from 'react-mathjax-preview'
import { Container } from 'react-bootstrap'

export default function ShowQuestion({question}) {

    const containerstyle={
        'minWidth': '100px',
        'minHeight': '100px',
        'touchAction': 'none',
        'background': '#4592af',
        'margin':"2rem",
        "borderRadius":"0.5rem",
        
        "padding": "0 0.5rem",
        "display": "flex",
        "flexDirection": "column",
        "justifyContent": "center",
        "alignItems": "center"
    }

    return (
        <Container style={containerstyle}>
            <h2>Solve following Question</h2>
            <MathJax math={'$$'+question+'$$'}/>
        </Container>
    )
}
