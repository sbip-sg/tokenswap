import React, { useState } from "react";
import { Form, Container, Col, Row } from "react-bootstrap";

import auth from "../support/Auth.js";
import axios from "axios";

import FormControls from "../support/FormControls.js";
import FormStyle from "../support/FormStyle.js";
import "../css/LoginPage.css";

import exchangePic from "../../images/login_exchangePic.svg";
import userIcon from "../../images/login_userIcon.svg";

export const LoginPage = (props) => {
    // axios.defaults.withCredentials = true;

    const [initialFValues, setState] = useState({
        username: '',
        password: ''
    });

    const validateFields = (fieldValues = values) => {
        let temp = { ...errors };
        if ("username" in fieldValues) {
            temp.username = fieldValues.username ? "" : "Username cannot be empty.";
        }
        if ("password" in fieldValues) {
            temp.password = fieldValues.password ? "" : "Password cannot be empty.";
        }
        setErrors({ ...temp });
        if (fieldValues === values) {
            return Object.values(temp).every(x => x === "");
        }
    };

    const { values, errors, setErrors, handleInputChange } = FormStyle(initialFValues, true, validateFields, setState);
    const handleSubmit = e => {
        if (validateFields()) {
            axios({
                method: 'POST',
                url: 'http://172.26.186.111:10050/corda/login',
                data: { address: 'localhost:10009', username: values.username, password: values.password },
                headers: { 'Content-Type': 'application/json; charset=utf-8' }
            }).then((res) => {
                if(res.data.code === 200) {
                    console.log("LOGIN SUCCESSFUL: " + res.status);
                    setState(prevState => ({
                        ...prevState
                    }));
                    localStorage.setItem("LOGIN_ACCESS_TOKEN", res.data.token);
                    auth.login(() => {
                        props.history.push({
                            pathname: "/dashboard",
                            state: { detail: ((JSON.stringify(res.data.data)).split("L")[0]).substring(3, ((JSON.stringify(res.data.data)).split("L")[0]).length-2) }
                        });
                    });
                } else if(res.data.code === 500) {
                    console.log("LOGIN FAILED: " + res.status);
                    window.alert("Invalid credentials entered. Please try again.");
                }
            }).catch((err) => {
                console.log("LOGIN FAILURE: " + err);
            })
        }
        e.preventDefault();
    };

    return (
        <Container>
            <Row>
                <Col lg={8} md={6} sm={12}>
                    <img className="w-100" src={exchangePic} alt=" " />
                </Col>
                <Col lg={4} md={6} sm={12} className="text-center mt-5 p-3">
                    <img className="img_userIcon" src={userIcon} alt="" />
                    <Form onSubmit={handleSubmit} className="mt-4">
                        <Form.Group controlId="fg_username">
                            <FormControls.InputField name="username" type="text" label="Username" value={values.username} onChange={handleInputChange} error={errors.username} />
                        </Form.Group>
                        <Form.Group controlId="fg_password">
                            <FormControls.InputField name="password" type="password" label="Password" value={values.password} onChange={handleInputChange} error={errors.password} />
                        </Form.Group>
                        <Form.Group controlId="fg_loginButton">
                            <FormControls.ButtonField type="submit" text="Login" />
                        </Form.Group>

                        <div className="text-left mt-3">
                            <a href="https://www.google.com"><small>Reset Password</small></a>&nbsp;|&nbsp;
                            <a href="https://www.google.com"><small>Register</small></a>
                        </div>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
}
