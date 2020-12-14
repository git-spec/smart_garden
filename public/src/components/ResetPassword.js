/* ********************************************************* IMPORT ********************************************************* */
// react
import React, {Fragment, useState} from 'react';
// reactstrap
import {Container, Row, Col, Form, FormGroup, Label, Input, Button} from 'reactstrap';
// router dom
import {useParams, Link} from 'react-router-dom';
// components
import PopUpModal from './PopUpModal';
// services
import {resetPasswordPost} from '../services/api';

/* ********************************************************* COMPONENT ********************************************************* */
const ResetPassword = () => {

    const params = useParams();

    const initialState = {
        password: '',
        repassword: '',
        showModal: false,
        modalTitle: '',
        modalContent: null
    };
    const [state, setState] = useState(initialState);

/* ********************************************************* SET NEW PASSWORD ********************************************************* */
    // If the user has indicated on the page that he has forgotten his password, he will receive an email with a link. 
    // Here he can enter a new password and use his account again.
    const onConfirmBtnClick = e => {
        e.preventDefault();
        if (state.password !== state.repassword || state.password.trim() === '') {
            const modalContentElement = (
                <ul>
                    {state.password.trim() === '' && <li>Please enter a password</li>}
                    {state.password !== state.repassword && <li>Passwords do not match</li>}
                </ul>
            );
            setState({
                ...state,
                showModal: true,
                modalContent: modalContentElement,
                modalTitle: 'Entry Error'
            });
        } else {
            resetPasswordPost(params.email, params.id, state.password).then(data => {
                switch (data) {
                    case 1:
                        setState({
                            ...state,
                            showModal: true,
                            modalContent: (
                                <p> 
                                    We have reset your password.<br/>
                                    Just log in <Link className="pr-1" to="/login">here</Link>!
                                </p>
                            ),
                            modalTitle: 'Password Was Successfully Changed'
                        });
                        break;
                    case 2:
                        setState({
                            ...state,
                            showModal: true,
                            modalContent: <p>There was a server error</p>,
                            modalTitle: 'Server Error'
                        });
                        break;
                    case 3:
                        setState({
                            ...state,
                            showModal: true,
                            modalContent: <p>The email you have used does not exist</p>,
                            modalTitle: 'Email Does Not Exist'
                        });
                        break;
                    default:
                        break;
                }
            }).catch(() => {
                setState({
                    ...state,
                    showModal: true,
                    modalContent: <p>Can not send the data</p>,
                    modalTitle: 'Unknown Error'
                });
            });
        }
    };

/* ********************************************************* RETURN ********************************************************* */
    return (
        <Fragment>
            <PopUpModal 
                className="bg-danger" 
                title={state.modalTitle}            
                show={state.showModal} 
                close={() => setState({...state, showModal: false})} 
            >
                {state.modalContent}
            </PopUpModal>
            <Container>
                <h1 className="text-trans mb-4">Reset Password</h1><br />
                <p className="text-trans mb-4">Please enter your new password.</p><br />
                <Form className="text-center pb-md-0 pb-5">
                    <Row>
                        <FormGroup>
                            <Col>
                                <Label className="w-100 h5 text-trans mb-2 ml-2">Password:</Label>
                                <Input
                                    className="badge-pill bg-transparent"
                                    type="password"
                                    placeholder="Enter your new password"
                                    required
                                    onChange={e => setState({...state, password: e.target.value})}
                                    value={state.password}
                                />
                                <span className="required-star">*</span>
                            </Col>
                            <Col>
                                <Label className="w-100 h5 text-trans mb-2 ml-2">Repeat Password:</Label>
                                <Input
                                    className="badge-pill bg-transparent"
                                    type="password"
                                    placeholder="Repeat your new password"
                                    required
                                    onChange={e => setState({...state, repassword: e.target.value})}
                                    value={state.repassword}
                                />
                                <span className="required-star">*</span>
                            </Col>
                        </FormGroup>
                        <Col>
                            <Button className="badge-pill btn-outline-light bg-transparent mt-8" onClick={onConfirmBtnClick}>
                                Confirm
                            </Button>
                        </Col>
                    </Row>
                </Form>
            </Container>
        </Fragment>
    );
};

/* ********************************************************* EXPORT ********************************************************* */
export default ResetPassword;
