import React from "react";
import { Form, Container, Col, Row } from "react-bootstrap";

import auth from "../support/Auth.js";
import FormControls from "../support/FormControls.js";
import FormStyle from "../support/FormStyle.js";
import "../css/LoginPage.css";

import exchangePic from "../../images/login_exchangePic.svg";
import userIcon from "../../images/login_userIcon.svg";

export const LoginPage = props => {
    const initialFValues = {
        partyName: '',
        partyPassword: ''
    };

    const validateFields = (fieldValues = values) => {
        let temp = { ...errors };
        if ("partyName" in fieldValues) {
            temp.partyName = fieldValues.partyName ? "" : "Party Name cannot be empty.";
        }
        if ("partyPassword" in fieldValues) {
            temp.partyPassword = fieldValues.partyPassword ? "" : "Password cannot be empty.";
        }

        setErrors({ ...temp });
        if (fieldValues === values) {
            return Object.values(temp).every(x => x === "");
        }
    };

    const { values, errors, setErrors, handleInputChange } = FormStyle(initialFValues, true, validateFields);
    const handleSubmit = e => {
        e.preventDefault();
        if (validateFields()) {
            auth.login(() => {
                props.history.push("/dashboard");
            });
        }
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
                        <Form.Group controlId="fg_partyName">
                            <FormControls.InputField name="partyName" type="text" label="Party Name" value={values.partyName} onChange={handleInputChange} error={errors.partyName} />
                        </Form.Group>
                        <Form.Group controlId="fg_partyPassword">
                            <FormControls.InputField name="partyPassword" type="password" label="Password" value={values.partyPassword} onChange={handleInputChange} error={errors.partyPassword} />
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
