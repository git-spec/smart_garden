/* ********************************************************* IMPORT ********************************************************* */
// react
import React, {Fragment, useEffect, useState} from 'react';
// redux
import {connect} from 'react-redux';
import {setBackgroundColor1Action, setBackgroundColor5Action} from '../actions';
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
function Contact(props) {

    const initialState = {
        email: '',
        message: '',
        showModal: false,
        modalClass: '',
        modalTitle: '',
        modalContent: null
    };
    const [state, setState] = useState(initialState);

/* ******************************************************** USE EFFECT ********************************************************* */
useEffect(() => {
    // set background color of nav
    props.setBackgroundColor5Action(null);
    props.setBackgroundColor1Action('color-1');
// eslint-disable-next-line
}, []);

/* ******************************************************** EVENTS ********************************************************* */
    const onSendBtnClick = e => {
        e.preventDefault();
        if (!validator.isEmail(state.email.trim()) || state.email.trim() === '' || state.message === '') {
            const modalContentElement = (
                <ul>
                    {!validator.isEmail(state.email.trim()) ? <li>Please enter a valid email</li> : null}
                    {state.email.trim() === '' ? <li>Please enter your email</li> : null}
                    {state.message === '' ? <li>Please enter your message</li> : null}
                </ul>
            );
            setState({
                ...state,
                modalClass: 'bg-danger',
                showModal: true,
                modalTitle: 'Entry Error',
                modalContent: modalContentElement
            });
        } else {
            sendMessagePost(state.email, state.message).then(data => {
                switch (data) {
                    case 2:
                        setState({
                            ...state,
                            modalClass: 'bg-danger',
                            showModal: true,
                            modalTitle: 'Server Error',
                            modalContent: <p>There was a server error</p>
                        });
                        break;
                    default:
                        setState({
                            ...state,
                            modalClass: 'bg-success',
                            showModal: true,
                            modalTitle: 'Message sent successfully',
                            modalContent: (
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
                        showModal: true,
                        modalTitle: 'Unknown Error',
                        modalContent: <p>Can not send the data</p>
                    });
                });
        }
    };

/* *********************************************************** RETURN ********************************************************* */
    return (
        <Fragment>
{/* *********************************************************** RETURN ********************************************************* */}
            <PopUpModal
                className={state.modalClass}
                title={state.modalTitle}         
                show={state.showModal}
                close={() => setState({...state, showModal: false})}
            >
                {state.modalContent}
            </PopUpModal>
{/* *********************************************************** HEADLINE ********************************************************* */}
            <Container className="pt-4 mt-5">
                <Col sm="12" md={{size: 6, offset: 3}}>
                    <h1 className="text-trans mb-4">Contact Us</h1>
                </Col>
{/* *********************************************************** FORM ********************************************************* */}
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
                                        onChange={e => setState({...state, email: e.target.value})}
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
export default connect(mapStateToProps, {setBackgroundColor5Action, setBackgroundColor1Action})(Contact);
