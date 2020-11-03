// react
import React, {Fragment, useState, useEffect} from 'react';
// reactstrap
import {
    Container,
    Row,
    Col,
    Form,
    FormGroup,
    Label,
    Input,
    Button
} from 'reactstrap';
// router dom
import {Link, useHistory} from 'react-router-dom';
// redux
import {connect} from 'react-redux';
import {setUserAction, setSocketAction} from '../actions';
// components
import PopUpModal from './PopUpModal';
// services
import {loginPost} from '../services/api';

const Login = props => {

    const {setUserAction, setSocketAction} = props;
    useEffect(() => {
        setUserAction(null);
        setSocketAction(null);
    }, [setUserAction, setSocketAction]);

    const history = useHistory();

    const initialState = {
        email: '',
        password: '',
        entriesError: false,
        errorTitle: '',
        errorElement: null
    };
    const [myState, setMyState] = useState(initialState);

    const onLoginBtnClick = e => {
        e.preventDefault();
        if (myState.email.trim() === '' || myState.password === '') {
            const errorElement = (
                <ul>
                    {myState.email.trim() === '' ? <li>Please enter your email</li> : null}
                    {myState.password === '' ? <li>Please enter your password</li> : null}
                </ul>
            );
            setMyState({
                ...myState,
                entriesError: true,
                errorTitle: 'Entry Error',
                errorElement
            });
        } else {
            loginPost(myState.email, myState.password).then(data => {
                switch (data) {
                    case 2:
                        setMyState({
                            ...myState,
                            entriesError: true,
                            errorTitle: 'Server Error',
                            errorElement: <p>There was a server error</p>
                        });
                        break;
                    case 3:
                        setMyState({
                            ...myState,
                            entriesError: true,
                            errorTitle: 'Wrong Password',
                            errorElement: <p>Your password is wrong</p>
                        });
                        break;
                    case 4:
                        setMyState({
                            ...myState,
                            entriesError: true,
                            errorTitle: 'Email Does Not Exist',
                            errorElement: <p>The email you have used does not exist</p>
                        });
                        break;
                    default:
                        setUserAction(data);
                        history.push('/user/dashboard');
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

    return (
        <Fragment>
            <PopUpModal show={myState.entriesError} close={closeModal} className="bg-danger" title={myState.errorTitle}>
                {myState.errorElement}
            </PopUpModal>
            <Container>
                {/* <div className="breadcrumb">
                <div className="container">
                    <Link className="breadcrumb-item" to="/">Home</Link>
                    <span className="breadcrumb-item active">Login</span>
                </div>
                </div> */}
                <h1 className="col-sm-12 col-md-6 offset-md-3 text-trans mb-4">Login</h1>
                <p className="col-sm-12 col-md-6 offset-md-3 text-trans mb-4">Log in to access your device management.</p>
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
                                        setMyState({
                                            ...myState,
                                            email: e.target.value
                                        });
                                    }}
                                    value={myState.email}
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
                                        <span className="pr-2">Forgot your <Link to="/password" className="pr-1">Password</Link>?</span>
                                    </Col>
                                </Row>
                                <Input
                                    className="badge-pill bg-transparent"
                                    type="password"
                                    placeholder="Enter your password"
                                    required
                                    onChange={e => {
                                        setMyState({
                                            ...myState,
                                            password: e.target.value
                                        });
                                    }}
                                    value={myState.password}
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

export default connect(null, {setUserAction, setSocketAction})(Login);