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
import {resetPass} from '../services/api';

/* ********************************************************* COMPONENT ********************************************************* */
const ResetPassword = () => {

    const params = useParams();

    const initialState = {
        password: '',
        repassword: '',
        entriesError: false,
        errorElement: null,
        errorTitle: ''
    };
    const [state, setState] = useState(initialState);

/* ********************************************************* EVENTS ********************************************************* */
    const onConfirmBtnClick = e => {
        e.preventDefault();
        if (state.password !== state.repassword || state.password.trim() === '') {
            const errorElement = (
                <ul>
                    {state.password.trim() === '' ? (
                        <li>Please enter a password</li>
                    ) : null}
                    {state.password !== state.repassword ? (
                        <li>Passwords do not match</li>
                    ) : null}
                </ul>
            );
            setState({
                ...state,
                entriesError: true,
                errorElement,
                errorTitle: 'Entry Error'
            });
        } else {
            resetPass(params.email, params.id, state.password).then(data => {
                switch (data) {
                    case 1:
                        setState({
                            ...state,
                            entriesError: true,
                            errorElement: (
                                <p> 
                                    We have reset your password.<br/>
                                    Just log in <Link className="pr-1" to="/login">here</Link>!
                                </p>
                            ),
                            errorTitle: 'Password Was Successfully Changed'
                        });
                        break;
                    case 2:
                        setState({
                            ...state,
                            entriesError: true,
                            errorElement: <p>There was a server error</p>,
                            errorTitle: 'Server Error'
                        });
                        break;
                    case 3:
                        setState({
                            ...state,
                            entriesError: true,
                            errorElement: <p>The email you have used does not exist</p>,
                            errorTitle: 'Email Does Not Exist'
                        });
                        break;
                    default:
                        break;
                }
            }).catch(() => {
                setState({
                    ...state,
                    entriesError: true,
                    errorElement: <p>Can not send the data</p>,
                    errorTitle: 'Unknown Error'
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

/* ********************************************************* RETURN ********************************************************* */
    return (
        <Fragment>
            <PopUpModal show={state.entriesError} close={closeModal} className="bg-danger" title={state.errorTitle}>
                {state.errorElement}
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

export default ResetPassword;
