import React from 'react';
import {Container, Row, Col, Form, FormGroup, Label, Input, Button} from 'reactstrap';

function Register() {
    return(
        <Container className="mt-5 pt-5">
            <h1 className="text-trans mb-4">Register</h1>
            <Form className="text-center pb-md-0 pb-5">
                <Row xs="1" sm="2">
                    <Col>
                        <FormGroup className="mb-md-4 mb-3 text-left">
                            <Label className="w-100 h5 text-trans mb-2 ml-2">First Name:</Label>
                            <Input className="badge-pill bg-transparent" placeholder="First Name" />
                        </FormGroup>
                    </Col>
                    <Col>
                        <FormGroup className="mb-4 text-left">
                            <Label className="w-100 h5 text-trans mb-2 ml-2">Last Name:</Label>
                            <Input className="badge-pill bg-transparent" placeholder="Last Name" />
                        </FormGroup>
                    </Col>
                    <Col>
                        <FormGroup className="mb-4 text-left">
                            <Label className="w-100 h5 text-trans mb-2 ml-2">Email:</Label>
                            <Input className="badge-pill bg-transparent" placeholder="Email" />
                        </FormGroup>
                    </Col>
                    <Col>
                        <FormGroup className="mb-4 text-left">
                            <Label className="w-100 h5 text-trans mb-2 ml-2">User Name:</Label>
                            <Input className="badge-pill bg-transparent" placeholder="User Name" />
                        </FormGroup>
                    </Col>
                    <Col>
                        <FormGroup className="mb-4 text-left">
                            <Label className="w-100 h5 text-trans mb-2 ml-2">Password:</Label>
                            <Input className="badge-pill bg-transparent" placeholder="Password" />
                        </FormGroup>
                    </Col>
                    <Col>
                        <FormGroup className="mb-3 text-left">
                            <Label className="w-100 h5 text-trans mb-2 ml-2">Repeat Password:</Label>
                            <Input className="badge-pill bg-transparent" placeholder="Repeat Password" />
                        </FormGroup>
                    </Col>
                </Row>
                <Button className="badge-pill btn-outline-light bg-transparent mt-4">SEND</Button>
            </Form>
        </Container>
    );
}

export default Register;