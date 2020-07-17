import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Table, Container } from "react-bootstrap"
import MathJax from 'react-mathjax-preview'

export default function Studentreport({ answer }) {
    const [studentlist, setStudentlist] = useState([]);

    let mylist = [{}];

    const result = (subject_item) => {
        if (subject_item.Result === "Correct")
            return (<img style={{ width: "20px", height: "20px" }} src={require('../assets/correct.png')} alt="Correct"/>)
        else if (subject_item.Result === "Wrong")
            return (<img style={{ width: "20px", height: "20px" }} src={require('../assets/close.png')} alt="Wrong"/>)
        else return (subject_item.Result);
    }

    const subject_wise = (subject_list) => {
        return (
            <Table responsive striped hover variant="dark">
                <thead>
                    <tr>
                        <th>Subject</th>
                        <th>Audio Text</th>
                        <th>Calculation</th>
                        <th>Option Selected</th>
                        <th>Correct Option</th>
                        <th>Result</th>
                    </tr>
                </thead>
                <tbody>

                    {subject_list.map((subject_item,index) => {
                        return (
                            <tr key={index}>
                                <td>{subject_item.Subject}</td>
                                <td>{subject_item.Audio}</td>
                                <td><MathJax math={'$$'+subject_item.Calculation+'$$'}/></td>
                                <td>{subject_item.Option_Selected}</td>
                                <td>{subject_item.Correct_Option}</td>
                                <td>{result(subject_item)}</td>
                            </tr>

                        )
                    })
                    }

        </tbody>
            </Table>
        )
    }

    useEffect(() => {
        axios.get(`/allstudents`).then((res) => {
            mylist = res.data; 
            setStudentlist(mylist.map((student,index) => {
                return (
                    <tr key={index}>
                        <td >{student.Name}</td>
                        <td >{subject_wise(student.Subjectwise_result)}</td>
                    </tr>
                );
            }))
        });
    }, []);

    return (

        <Container>
            <Table responsive >

                <thead>
                    <tr>
                        <th style={{ textAlign: "center" }}>Name</th>
                        <th style={{ textAlign: "center" }}>Subject wise Result</th>

                    </tr>
                </thead>
                <tbody>
                    {studentlist}
                </tbody>
            </Table>
        </Container>

    )

}
