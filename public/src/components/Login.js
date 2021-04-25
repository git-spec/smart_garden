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
// hooks
import {validateChar, validateInp} from '../hooks/useValidation';

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
            loginname: false,
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
    // check blur of inputs
    const handleBlur = field => e => {
        e.preventDefault();
        setState({
            ...state,
            touched: {...state.touched, [field]: true}
        });
    }
    // check exsiting input
    // change border-color of inputs to danger
    const inpErrs = validateInp({loginname: state.loginName, password: state.password});
    // const isEnabled =  state.loginName.trim().length > 0 &&  state.password.length > 0;
    // show input error message
    const markInpError = field => {
        const hasError = inpErrs.input[field];
        const showError = state.touched[field];
        return hasError ? showError : false;
    }
    // check characters
    const charErrs = validateChar({char: [state.loginName]});
    // show character error message
    const markCharError = field => {
        let hasError = '';
        const showError = state.touched[field];
        switch (field) {
            case 'loginname':
                charErrs.user.char[0] ?  hasError = true : hasError = false;
                return hasError ? showError : false;
            default:
                break;
        };
    }
    // enable login-button
    const isEnabled = !Object.keys(inpErrs.input).some(x => inpErrs.input[x]) && !Object.keys(charErrs.user).some(x => charErrs.user[x]);
  
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
            <Container className="px-4 px-sm-5 px-md-0 pt-5 pb-0 mt-5">
                <Col xs="12" sm={{size: 8, offset: 2}} lg={{size: 6, offset: 3}} xl={{size: 4, offset: 4}} className="px-0 px-md-auto">
                    <h1 className="text-trans mb-4 px-0 mt-2 mt-sm-0">Login</h1>
                    <h5 className="text-trans mb-4 px-0">
                        Sign in to access your device management.
                    </h5>
                </Col>
                <Form className="pb-md-0 pb-3">
                    <Col xs="12" sm={{size: 8, offset: 2}} lg={{size: 6, offset: 3}} xl={{size: 4, offset: 4}} className="px-0 px-md-auto">
                        <FormGroup className="mb-1 text-left">
                            <Label className="w-100 h5 text-trans mb-2 ml-2">Username / Email:</Label>
                            <Input
                                className={"badge-pill bg-transparent " + (markInpError('loginname') || markCharError('loginname') ? "error" : "")}
                                type="text"
                                placeholder="Enter your username or email"
                                value={state.loginName}
                                onChange={e => setState({...state, loginName: e.target.value})}
                                onBlur={handleBlur('loginname')}
                                required
                            />
                        </FormGroup>
                        <p className="error mb-2 ml-2">
                            &nbsp;
                            {
                                state.loginName.trim() === ''
                            ?
                                markInpError('loginname') ? "Please enter your user name or email." : ""
                            :
                                markCharError('loginname') ? "Please enter a valid user name or email." : ""
                            }
                        </p>
                    </Col>
                    <Col xs="12" sm={{size: 8, offset: 2}} lg={{size: 6, offset: 3}} xl={{size: 4, offset: 4}} className="px-0 px-md-auto">
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
                    <Col xs="12" sm={{size: 8, offset: 2}} lg={{size: 6, offset: 3}} xl={{size: 4, offset: 4}} className="px-0 px-md-auto">
                        <h5 className="mt-2">
                            Not registered?&nbsp;
                            <Link to="/register">Register</Link>
                        </h5>
                    </Col>
                </Form>
                <Col xs="12" className="text-center text-trans">
                    <Button className="badge-pill btn-outline-light bg-transparent mt-4 mb-3" onClick={onLoginBtnClick} disabled={!isEnabled}>
                        Login
                    </Button>
                </Col>
            </Container>
        </Fragment>
    );
};

/* ********************************************************* EXPORT ********************************************************* */
export default connect(null, {setUserAction, setSocketAction, setBackgroundColor5Action, setBackgroundColor1Action})(Login);
