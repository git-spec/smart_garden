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
        loginName: '',
        password: '',
        showModal: false,
        modalClass: '',
        modalTitle: '',
        modalContent: null,
        touched: {
            loginName: false,
            password: false
        }
    };
    const [state, setState] = useState(initialState);

    useEffect(() => {
        // deletes user and sets background color in redux
        props.setUserAction(null);
        props.setBackgroundColor1Action('color-1');
        props.setBackgroundColor5Action(null);
    // eslint-disable-next-line
    }, []);

/* ********************************************************* FUNCTIONS ********************************************************* */    
    // check exsiting input
    const validateInp = (name, password) => {
        return {loginName: name.length === 0, password: password.length === 0};
    }
    // change border-color of inputs to danger
    const inpErrs = validateInp(state.loginName, state.password);
    // const isEnabled =  state.loginName.trim().length > 0 &&  state.password.length > 0;
    // check blur of inputs
    const handleBlur = field => e => {
        e.preventDefault();
        setState({
            ...state,
            touched: {...state.touched, [field]: true}
        });
    }
    // show input error message
    const markInpError = field => {
        const hasError = inpErrs[field];
        const showError = state.touched[field];
        return hasError ? showError : false;
    }
    // check characters
    const validateChar = (name) => {
        // eslint-disable-next-line
        return {loginName: !name.match(/^([A-ZÀ-Üa-zß-ü0-9!?@#$: \+\.\-]*)([A-ZÀ-Üa-zß-ü0-9!?@#$: \+\.\-]*)$/g)};
    }
    const charErrs = validateChar(state.loginName);
    // show character error message
    const markCharError = field => {
        const hasError = charErrs[field];
        const showError = state.touched[field];
        return hasError ? showError : false;
    }
    // enable login-button
    const isEnabled = !Object.keys(inpErrs).some(x => inpErrs[x]) && !Object.keys(charErrs).some(x => charErrs[x]);
  
    // The user can log in and enter the secure user area by entering the email or username and password.
    const onLoginBtnClick = e => {
        e.preventDefault();
        loginPost(state.loginName, state.password).then(data => {
            switch (data) {
                case 2:
                    setState({
                        ...state,
                        showModal: true,
                        modalClass: 'danger',
                        modalTitle: 'Server Error',
                        modalContent: <p>The server is not responding.</p>
                    });
                    break;
                case 3:
                    setState({
                        ...state,
                        showModal: true,
                        modalClass: 'danger',
                        modalTitle: 'Warning',
                        modalContent: <p>The email does not exist.</p>
                    });
                    break;
                case 4:
                    setState({
                        ...state,
                        showModal: true,
                        modalClass: 'danger',
                        modalTitle: 'Warning',
                        modalContent: <p>The username does not exist.</p>
                    });
                    break;
                case 5:
                    setState({
                        ...state,
                        showModal: true,
                        modalClass: 'danger',
                        modalTitle: 'Warning',
                        modalContent: <p>The password is wrong.</p>
                    });
                    break;
                case 6:
                    setState({
                        ...state,
                        showModal: true,
                        modalClass: 'danger',
                        modalTitle: 'Warning',
                        modalContent: <p>Please fill out correctly!</p>
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
                showModal: true,
                modalClass: 'danger',
                modalTitle: 'Unkown Error',
                modalContent: <p>The data cannot been sent.</p>
            });
        });
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
            <Container fluid={true} className="px-4 px-sm-0 pt-5 pb-0 mt-5">
                <h1 className="col-sm-12 col-md-6 offset-md-3 text-trans mb-4 px-0 px-md-3">Login</h1>
                <h5 className="col-sm-12 col-md-6 offset-md-3 text-trans mb-4 px-0 px-md-3">
                    Sign in to access your device management.
                </h5>
                <Form className="pb-md-0 pb-3">
                    <Col sm="12" md={{size: 6, offset: 3}}>
                        <FormGroup className="mb-1 text-left">
                            <Label className="w-100 h5 text-trans mb-2 ml-2">Username / Email:</Label>
                            <Input
                                className={"badge-pill bg-transparent " + (markInpError('loginName') ? "error" : "")}
                                type="text"
                                placeholder="Enter your username or email"
                                value={state.loginName}
                                onChange={e => setState({...state, loginName: e.target.value})}
                                onBlur={handleBlur('loginName')}
                                required
                            />
                        </FormGroup>
                        <p className="error mb-2 ml-2">
                            &nbsp;
                            {
                                state.loginName.trim() === ''
                            ?
                                markInpError('loginName') ? "Please enter your user name or email." : ""
                            :
                                markCharError('loginName') ? "Please enter a valid user name or email." : ""
                            }
                        </p>
                    </Col>
                    <Col sm="12" md={{size: 6, offset: 3}}>
                        <FormGroup className="mb-1 text-left">
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
                                className={"badge-pill bg-transparent " + (markInpError('password') ? "error" : "")}
                                type="password"
                                placeholder="Enter your password"
                                value={state.password}
                                onChange={e => setState({...state, password: e.target.value})}
                                onBlur={handleBlur('password')}
                                required
                            />
                        </FormGroup>
                        <p className="error mb-2 ml-2">&nbsp;{markInpError('password') ? "Please enter your password." : ""}</p>
                    </Col>
                    <Col sm="12" md={{size: 6, offset: 3}}>
                        <h5 className="mt-2">
                            Not registered?&nbsp;
                            <Link to="/register">Register</Link>
                        </h5>
                    </Col>
                </Form>
                <Col sm="12" className="text-center text-trans">
                    <Button className="badge-pill btn-outline-light bg-transparent my-4" onClick={onLoginBtnClick} disabled={!isEnabled}>
                        Login
                    </Button>
                </Col>
            </Container>
        </Fragment>
    );
};

/* ********************************************************* EXPORT ********************************************************* */
export default connect(null, {setUserAction, setSocketAction, setBackgroundColor5Action, setBackgroundColor1Action})(Login);
