/* ********************************************************* IMPORT ********************************************************* */
// react
import React, {Fragment, useState} from 'react';
// reactstrap
import {Container, Row, Col, Form, FormGroup, Label, Input, Button} from 'reactstrap';
// components
import PopUpModal from './PopUpModal';
// services
import {sendResetLinkPost} from '../services/api';

/* ********************************************************* COMPONENT ********************************************************* */
const ForgotPassword = props => {

    const initialState = {
        email: '',
        showModal: false,
        modalClass: '',
        modalTitle: '',
        modalContent: null
    };
    const [state, setState] = useState(initialState);

/* ********************************************************* SEND BUTTON ********************************************************* */
    const onSendBtnClick = e => {
        e.preventDefault();
        if (state.email.trim() === '') {
            setState({
                ...state,
                showModal: true,
                modalTitle: 'Entry Error',
                modalContent: <p>Please enter your email</p>,
                modalClass: 'bg-danger'
            });
        } else {
            sendResetLinkPost(state.email.trim()).then(data => {
                switch (data) {
                    case 1:
                        setState({
                            ...state,
                            showModal: true,
                            modalTitle: 'Reset Email Sent',
                            modalContent: <p>We have sent you a reset email,<br/>please check your emails!</p>,
                            modalClass: 'bg-success'
                        });
                        break;
                    case 2:
                        setState({
                            ...state,
                            showModal: true,
                            modalTitle: 'Server Error',
                            modalContent: <p>There was a server error</p>,
                            modalClass: 'bg-danger'
                        });
                        break;
                    case 3:
                        setState({
                            ...state,
                            showModal: true,
                            modalTitle: 'Email Does Not Exist',
                            modalContent: <p>The email you have used does not exist</p>,
                            modalClass: 'bg-danger'
                        });
                        break;
                    default:
                        break;
                }
            }).catch(() => {
                setState({
                    ...state,
                    showModal: true,
                    modalTitle: 'Unknown Error',
                    modalContent: <p>Can not send the data</p>,
                    modalClass: 'bg-danger'
                });
            });
        }
    };

/* ********************************************************* RETURN ********************************************************* */
    return (
        <Fragment>
            <PopUpModal
                className={state.modalClass} 
                title={state.modalTitle}            
                show={state.showModal} 
                close={() => setState({...state, showModal: false})} 
            >
                {state.modalContent}
            </PopUpModal>
            <Container className="pt-4 mt-5">
                <Col sm="12" md={{size: 6, offset: 3}}>
                    <h1 className="text-trans mb-4">Password</h1>
                    <p className="text-trans mb-4">Forgot your password? Enter your email address to receive a link to reset it.</p>
                </Col>
                <Form className="pb-md-0 pb-5">
                    <Row>
                        <Col sm="12" md={{size: 6, offset: 3}}>
                            <FormGroup className="mb-md-4 mb-3 text-left">
                                <Label className="w-100 h5 text-trans mb-2 ml-2">Email:</Label>
                                <Input
                                    className="badge-pill bg-transparent"
                                    type="email"
                                    placeholder="Enter your email"
                                    required
                                    onChange={e => setState({...state, email: e.target.value})}
                                    value={state.email}
                                />
                            </FormGroup>
                        </Col>
                        <Col sm="12" className="text-center text-trans">
                            <Button className="badge-pill btn-outline-light bg-transparent mt-4" onClick={onSendBtnClick}>
                                Send
                            </Button>
                        </Col>
                    </Row>
                </Form>
            </Container>
        </Fragment>
    );
};

/* ********************************************************* EXPORT ********************************************************* */
export default ForgotPassword;