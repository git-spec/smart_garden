// react
import React, { Fragment, useState} from "react";
// redux
import { connect } from "react-redux";
// router dom
import { Link } from "react-router-dom";
// reactstrap
import {
    Container,
    Col,
    Row,
    Form,
    FormGroup,
    Label,
    Input,
    Button,
} from "reactstrap";
import PopUpModal from './PopUpModal';
// services
import {sendMessagePost} from '../services/api';
// validator
import validator from 'validator'

function Kontakt() {
    
    const initialState = {
        email: '',
        message: '',
        popClassName:'',
        entriesError: false,
        errorTitle: '',
        errorElement: null
    };
    const [myState, setMyState] = useState(initialState);

    const onSendBtnClick = e => {
        e.preventDefault();
        if (!validator.isEmail(myState.email.trim()) || myState.email.trim() === '' || myState.message === '') {
            const errorElement = (
                <ul>
                    {!validator.isEmail(myState.email.trim())? <li>Please enter a Valid email</li> : null}
                    {myState.email.trim() === '' ? <li>Please enter your email</li> : null}
                    {myState.message === '' ? <li>Please enter your message</li> : null}
                </ul>
            );
            setMyState({
                ...myState,
                popClassName:'bg-danger',
                entriesError: true,
                errorTitle: 'Entry Error',
                errorElement: errorElement
            });
        } else {
            sendMessagePost(myState.email, myState.message).then(data => {
                switch (data) {
                    case 2:
                        setMyState({
                            ...myState,
                            popClassName:'bg-danger',
                            entriesError: true,
                            errorTitle: 'Server Error',
                            errorElement: <p>There was a server error</p>
                        });
                        break;
                    default:
                        setMyState({
                            ...myState,
                            popClassName: 'bg-success',
                            entriesError: true,
                            errorTitle: 'Data Sended Successfully',
                            errorElement: <p>Your Message has been sended <br/> Thank you for your Message</p>
                        });
                        break;
                }
            }).catch(error => {
                setMyState({
                    ...myState,
                    entriesError: true,
                    errorTitle: 'Unknown Error',
                    errorElement: <p>Can not send the data</p>
                });
            });
        }
    };
    
    const closeModal = () => {
        setMyState({
            ...myState,
            entriesError: false
        });
    };
    /* *********************************************************** RETURN ********************************************************* */
    return (
        <Fragment>
            <PopUpModal show={myState.entriesError} close={closeModal} className={myState.popClassName} title={myState.errorTitle}>
                {myState.errorElement}
            </PopUpModal>
            <Container>
                <h1>
                    <strong>Contact Us</strong>
                </h1>
                <br/>
                <br/>


                <Row>
                    <Form className="pb-md-0 pb-5">
                        <Row xs="1" sm="1">
                            <Col sm="12" md={{ size: 6, offset: 3 }}>
                                <FormGroup className="mb-md-4 mb-3 text-left">
                                    <Label className="w-100 h5 text-trans mb-2 ml-2">
                                        Email / User Name:
                                    </Label>
                                    <Input
                                        className="badge-pill bg-transparent"
                                        type="email"
                                        placeholder="Enter your email or user name"
                                        required
                                        onChange={(e) => {
                                            setMyState({
                                                ...myState,
                                                email: e.target.value,
                                            });
                                        }}
                                        value={myState.email}
                                    />
                                </FormGroup>
                            </Col>
                            <Col sm="12" md={{ size: 6, offset: 3 }}>
                                <FormGroup className="mb-4 text-left">
                                    <Row>
                                        <Col xs="6" lg="6">
                                            <Label className="w-100 h5 text-trans mb-2 ml-2">
                                                Write Your Message Here:
                                            </Label>
                                        </Col>
                                        <Col
                                            xs="8"
                                            lg="6"
                                            className="text-right"
                                        ></Col>
                                    </Row>
                                    <textarea
                                        className="badge-pill rounded bg-transparent"
                                        type="text"
                                        placeholder="Enter your Message..."
                                        required
                                        cols="72"
                                        rows="10"
                                        onChange={(e) => {
                                            setMyState({
                                                ...myState,
                                                message: e.target.value,
                                            });
                                        }}
                                        value={myState.message}
                                    />
                                </FormGroup>
                            </Col>
                            <Col sm="12" className="text-center text-trans">
                                <Button
                                    className="badge-pill btn-outline-light bg-transparent my-4"
                                    onClick={onSendBtnClick}
                                >
                                    Send
                                </Button>
                            </Col>
                            <Col sm="12" md={{ size: 6, offset: 3 }}>
                                <h5>
                                    Not registered?&nbsp;
                                    <Link to="/register">Register</Link>
                                </h5>
                            </Col>
                        </Row>
                    </Form>
                </Row>
            </Container>
        </Fragment>
    );
}
const mapStateToProps = (state) => {
    return { user: state.user };
};
export default connect(mapStateToProps)(Kontakt);
