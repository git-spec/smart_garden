/* ********************************************************* IMPORT ********************************************************* */
// react
import React, {Fragment, useState} from 'react';
// redux
import {connect} from 'react-redux';
// router dom
import {Link} from 'react-router-dom';
// reactstrap
import {Container, Col, Row, Form, FormGroup, Label, Input, Button} from 'reactstrap';
import PopUpModal from './PopUpModal';
// services
import {sendMessagePost} from '../services/api';
// validator
import validator from 'validator';

/* ******************************************************** COMPONENT ********************************************************* */
function Contact() {

    const initialState = {
        email: '',
        message: '',
        popClassName: '',
        entriesError: false,
        errorTitle: '',
        errorElement: null
    };
    const [state, setState] = useState(initialState);

/* ******************************************************** EVENTS ********************************************************* */
    const onSendBtnClick = e => {
        e.preventDefault();
        if (!validator.isEmail(state.email.trim()) || state.email.trim() === '' || state.message === '') {
            const errorElement = (
                <ul>
                    {!validator.isEmail(state.email.trim()) ? <li>Please enter a Valid email</li> : null}
                    {state.email.trim() === '' ? <li>Please enter your email</li> : null}
                    {state.message === '' ? <li>Please enter your message</li> : null}
                </ul>
            );
            setState({
                ...state,
                popClassName: 'bg-danger',
                entriesError: true,
                errorTitle: 'Entry Error',
                errorElement: errorElement
            });
        } else {
            sendMessagePost(state.email, state.message).then(data => {
                switch (data) {
                    case 2:
                        setState({
                            ...state,
                            popClassName: 'bg-danger',
                            entriesError: true,
                            errorTitle: 'Server Error',
                            errorElement: <p>There was a server error</p>
                        });
                        break;
                    default:
                        setState({
                            ...state,
                            popClassName: 'bg-success',
                            entriesError: true,
                            errorTitle: 'Message sent successfully',
                            errorElement: (
                                <p>
                                    Your message has been sent.<br /> 
                                    Thank you for your message.
                                </p>
                            )
                        });
                        break;
                    }
                }).catch(() => {
                    setState({
                        ...state,
                        entriesError: true,
                        errorTitle: 'Unknown Error',
                        errorElement: <p>Can not send the data</p>
                    });
                });
        }
    };

    const closeModal = () => {
        setState({
            ...state,
            entriesError: false
        });
    };

/* *********************************************************** RETURN ********************************************************* */
    return (
        <Fragment>
            <PopUpModal
                show={state.entriesError}
                close={closeModal}
                className={state.popClassName}
                title={state.errorTitle}
            >
                {state.errorElement}
            </PopUpModal>
            <Container className="pt-4 mt-5">
                <Col sm="12" md={{size: 6, offset: 3}}>
                    <h1 className="text-trans mb-4">Contact Us</h1>
                </Col>
                <Row>
                    <Form className="pb-md-0 pb-5">
                        <Row xs="1" sm="1">
                            <Col sm="12" md={{size: 6, offset: 3}}>
                                <FormGroup className="mb-md-4 mb-3 text-left">
                                    <Label className="w-100 h5 text-trans mb-2 ml-2">Email / User Name:</Label>
                                    <Input
                                        className="badge-pill bg-transparent"
                                        type="email"
                                        placeholder="Enter your email or user name"
                                        required
                                        onChange={e => {
                                            setState({
                                                ...state,
                                                email: e.target.value
                                            });
                                        }}
                                        value={state.email}
                                    />
                                </FormGroup>
                            </Col>
                            <Col sm="12" md={{size: 6, offset: 3}}>
                                <FormGroup className="mb-4 text-left">
                                    <Row>
                                        <Col xs="6" lg="6">
                                            <Label className="w-100 h5 text-trans mb-2 ml-2">
                                                Message:
                                            </Label>
                                        </Col>
                                        <Col xs="8" lg="6" className="text-right"></Col>
                                    </Row>
                                    <textarea
                                        className="badge-pill rounded bg-transparent "
                                        type="text"
                                        placeholder="Write your message"
                                        required
                                        cols="72"
                                        rows="10"
                                        onChange={e => setState({...state, message: e.target.value})}
                                        value={state.message}
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
                            <Col sm="12" md={{size: 6, offset: 3}}>
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

/* ********************************************************* MAP STATE TO PROPS ********************************************************* */
const mapStateToProps = state => {
    return {user: state.user};
};

/* ********************************************************* EXPORT ********************************************************* */
export default connect(mapStateToProps)(Contact);
