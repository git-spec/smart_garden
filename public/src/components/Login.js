/* ********************************************************* IMPORT ********************************************************* */
// react
import React, {Fragment, useState, useEffect} from 'react';
// reactstrap
import {Container, Row, Col, Form, FormGroup, Label, Input, Button} from 'reactstrap';
// router dom
import {Link, useHistory} from 'react-router-dom';
// redux
import {connect} from 'react-redux';
import {setUserAction, setSocketAction, setBackgroundColor5Action, setBackgroundColor1Action} from '../actions';
// components
import PopUpModal from './PopUpModal';
// services
import {loginPost} from '../services/api';

/* ********************************************************* COMPONENT ********************************************************* */
const Login = props => {

    const history = useHistory();

    const initialState = {
        email: '',
        password: '',
        entriesError: false,
        errorTitle: '',
        errorElement: null
    };
    const [state, setState] = useState(initialState);

    useEffect(() => {
        props.setUserAction(null);
        props.setBackgroundColor1Action('color-1');
        props.setBackgroundColor5Action(null);
    // eslint-disable-next-line
    }, []);

/* ********************************************************* EVENTS ********************************************************* */
    const onLoginBtnClick = e => {
        e.preventDefault();
        if (state.email.trim() === '' || state.password === '') {
            const errorElement = (
                <ul>
                    {state.email.trim() === '' ? <li>Please enter your email</li> : null}
                    {state.password === '' ? <li>Please enter your password</li> : null}
                </ul>
            );
            setState({
                ...state,
                entriesError: true,
                errorTitle: 'Entry Error',
                errorElement
            });
        } else {
            loginPost(state.email, state.password).then(data => {
                switch (data) {
                    case 2:
                        setState({
                            ...state,
                            entriesError: true,
                            errorTitle: 'Server Error',
                            errorElement: <p>There was a server error</p>
                        });
                        break;
                    case 3:
                        setState({
                            ...state,
                            entriesError: true,
                            errorTitle: 'Wrong Password',
                            errorElement: <p>Your password is wrong</p>
                        });
                        break;
                    case 4:
                        setState({
                            ...state,
                            entriesError: true,
                            errorTitle: 'Email Does Not Exist',
                            errorElement: <p>The email you have used does not exist</p>
                        });
                        break;
                    default:
                        props.setUserAction(data);
                        if (data.role === 'admin') {
                            history.push('/user/admin');
                        } else if (data.role === 'subadmin') {
                            history.push('/user/subadmin');
                        } else {
                            history.push('/user/dashboard');
                        }
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

/* ********************************************************* RETURN ********************************************************* */
    return (
        <Fragment>
            <PopUpModal show={state.entriesError} close={closeModal} className="bg-danger" title={state.errorTitle}>
                {state.errorElement}
            </PopUpModal>
            <Container className="pt-5 mt-5">
                <h1 className="col-sm-12 col-md-6 offset-md-3 text-trans mb-4 mt-5 px-0 px-md-3">Login</h1>
                <p className="col-sm-12 col-md-6 offset-md-3 text-trans mb-4 px-0 px-md-3">
                    Log in to access your device management.
                </p>
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
                                    <Col xs="4" lg="6">
                                        <Label className="w-100 h5 text-trans mb-2 ml-2">Password:</Label>
                                    </Col>
                                    <Col xs="8" lg="6" className="text-right">
                                        <span className="pr-2">
                                            Forgot your{' '}
                                            <Link to="/password" className="pr-1">
                                                Password
                                            </Link>
                                            ?
                                        </span>
                                    </Col>
                                </Row>
                                <Input
                                    className="badge-pill bg-transparent"
                                    type="password"
                                    placeholder="Enter your password"
                                    required
                                    onChange={e => setState({...state, password: e.target.value})}
                                    value={state.password}
                                />
                            </FormGroup>
                        </Col>
                        <Col sm="12" md={{size: 6, offset: 3}}>
                            <h5>
                                Not registered?&nbsp;
                                <Link to="/register">Register</Link>
                            </h5>
                        </Col>
                    </Row>
                </Form>
                <Col sm="12" className="text-center text-trans">
                    <Button className="badge-pill btn-outline-light bg-transparent my-4" onClick={onLoginBtnClick}>
                        Login
                    </Button>
                </Col>
            </Container>
        </Fragment>
    );
};

export default connect(null, {setUserAction, setSocketAction, setBackgroundColor5Action, setBackgroundColor1Action})(Login);
