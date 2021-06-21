import React from "react";
import { Button, Form, Container, Col, Row } from "react-bootstrap";

import auth from "../support/Auth.js";
import "../css/LoginPage.css";

import exchangePic from "../../images/login_exchangePic.svg";
import userIcon from "../../images/login_userIcon.svg"

export const LoginPage = props => {
    return (
        <>
            <Container>
                <Row>
                    <Col lg={8} md={6} sm={12}>
                        <img className="w-100" src={exchangePic} alt=" " />
                    </Col>
                    <Col lg={4} md={6} sm={12} className="text-center mt-5 p-3">
                        <img className="img_userIcon" src={userIcon} alt="" />
                        <Form className="mt-4">
                            <Form.Group controlId="fg_partyName">
                                <Form.Control type="text" placeholder="Party Name" />
                            </Form.Group>
                            <Form.Group controlId="fg_password">
                                <Form.Control type="password" placeholder="Password" />
                            </Form.Group>

                            <Button variant="primary btn-block" type="button" onClick={() => {
                                auth.login(() => {
                                    props.history.push("/dashboard");
                                });
                            }}>Login</Button>

                            <div className="text-left mt-3">
                                <a href="https://www.google.com"><small>Reset Password</small></a>&nbsp;|&nbsp;
                                <a href="https://www.google.com"><small>Register</small></a>
                            </div>
                        </Form>
                    </Col>
                </Row>
            </Container>
        </>
    );
}
