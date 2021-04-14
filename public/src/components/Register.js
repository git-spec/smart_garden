/* ********************************************************* IMPORT ********************************************************* */
// react
import React, {Fragment} from 'react';
// redux
import {connect} from 'react-redux';
import {setBackgroundImageAction, setBackgroundColor1Action, setBackgroundColor5Action} from '../actions';
// router dom
import {Link} from 'react-router-dom';
// reactstrap
import {Container, Row, Col, Form, FormGroup, Label, Input, Button} from 'reactstrap';
// components
import PopUpModal from './PopUpModal';
// services
import {getUserPost, registerPost} from '../services/api';

/* ********************************************************* COMPONENT ********************************************************* */
class Register extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            firstName: '',
            lastName: '',
            userName: '',
            email: '',
            password: '',
            repassword: '',
            showModal: false,
            existUserName: false,
            modalContent: {
                class: '',
                title: '',
                message: ''
            },
            touched: {
                firstName: false,
                lastName: false,
                userName: false,
                email: false,
                password: false,
                repassword: false
            }
        };
    }

    componentDidMount() {
        this.props.setBackgroundColor1Action("color-1");
        this.props.setBackgroundColor5Action(null);
    }
    
/* ********************************************************* FUNCTIONS ********************************************************* */    
    // check exsiting input
    validateInp = (firstName, lastName, userName, email, password, repassword) => {
        return {
            firstName: firstName.length === 0,
            lastName: lastName.length === 0,
            userName: userName.length === 0,
            email: email.length === 0,
            password: password.length === 0,
            repassword: repassword.length === 0
        };
    }  
    // check characters
    validateChar = (firstName, lastName, userName, email, password) => {
        return {
            // eslint-disable-next-line
            firstName: !firstName.match(/^[A-ZÀ-Üa-zß-ü]+[\.]?[ \-]?([A-ZÀ-Üa-zß-ü ]*)$/g),           // [^0-9!@#$%^&*()_+\=\[\]{};':"\\|,<>\/?]?
            // eslint-disable-next-line
            lastName: !lastName.match(/^[A-ZÀ-Üa-zß-ü]+[\.]?[ \-]?([A-ZÀ-Üa-zß-ü ]*)$/g),
            // eslint-disable-next-line
            userName: !userName.match(/^([A-ZÀ-Üa-zß-ü0-9!?@#$: \+\.\-]*)([A-ZÀ-Üa-zß-ü0-9!?@#$: \+\.\-]*)$/g),
            email: !email.match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/),
            // password: validator.isStrongPassword(password)
        };
    }
    // check username
    checkExistence = userName => {
            getUserPost(userName).then(result => {
                if (result.username) {
                    this.setState({...this.state, existUserName: true});
                } else {
                    this.setState({...this.state, existUserName: false});
                }
            }).catch(err => err);
    };
    // check blur of inputs
    handleBlur = field => e => {
        e.preventDefault();
        this.setState({
            ...this.state,
            touched: {...this.state.touched, [field]: true}
        });
    }

/* ********************************************************* REGISTRATION ********************************************************* */
    // The user can register on the site by entering his name, email, a user name of his choice and a password. 
    // If all fields are filled in correctly, the user will receive an email with a link to verify the email 
    // and complete the registration.
    onRegisterBtnClick = e => {
        e.preventDefault();
        registerPost(
            this.state.firstName,
            this.state.lastName,
            this.state.userName,
            this.state.email,
            this.state.password,
            this.state.repassword
        ).then(data => {
            let modalClass = '';
            let modalTitle = '';
            let modalMessage = '';
            switch (data) {
                case 1:
                    this.setState({showModal: true});
                    modalClass = 'success';
                    modalTitle = 'Success';
                    modalMessage = <p>Congratulation, you registered successfully!<br />Please check your mails to verify your account.</p>;
                    break;
                case 2:
                    this.setState({showModal: true});
                    modalClass = 'danger';
                    modalTitle = 'Warning';
                    modalMessage = <p>Server error, please contact the administrator!</p>;
                    break;
                case 3:
                    this.setState({showModal: true});
                    modalClass = 'danger';
                    modalTitle = 'Warning';
                    modalMessage = <p>There is already a user with this email.<br />Please choose another one.</p>;
                    break;
                case 4:
                    this.setState({showModal: true});
                    modalClass = 'danger';
                    modalTitle = 'Warning';
                    modalMessage = <p>There is already a user with this username.<br />Please choose another one.</p>;
                    break;
                case 5:
                    this.setState({showModal: true});
                    modalClass = 'danger';
                    modalTitle = 'Warning';
                    modalMessage = <p>There is already a user with this username and email.<br />Please choose another one.</p>;
                    break;
                case 6:
                    this.setState({showModal: true});
                    modalClass = 'danger';
                    modalTitle = 'Warning';
                    modalMessage = <p>The email does not answer.<br />Please choose another one.</p>;
                    break;
                case 10:
                    this.setState({showModal: true});
                    modalClass = 'danger';
                    modalTitle = 'Warning';
                    modalMessage = <p>Please fill out correctly!</p>;
                    break;
                default:
                    break;
            }
            this.setState({
                modalContent: {
                    class: modalClass,
                    title: modalTitle,
                    message: modalMessage
                }
            });
        }).catch(() => {
            this.setState({
                modalContent: {
                    class: 'danger',
                    title: 'Warning',
                    message: <p>Can not send the registration data to server!</p>
                }
            });
        });
    };

/* ********************************************************* RENDER ********************************************************* */
    render() {
        // change border-color of inputs to danger
        const inputErrs = this.validateInp(
            this.state.firstName,
            this.state.lastName,
            this.state.userName,
            this.state.email,
            this.state.password,
            this.state.repassword
        );
        // change border-color of inputs to danger
        const charErrs = this.validateChar(
            this.state.firstName,
            this.state.lastName,
            this.state.userName,
            this.state.email,
            this.state.password
        );
        // show error message for input error
        const touched = this.state.touched
        function markInpError(field) {
            const hasError = inputErrs[field];
            const showError = touched[field];
            return hasError ? showError : false;
        }
        // show error message for character error
        function markCharError(field) {
            const hasError = charErrs[field];
            const showError = touched[field];
            return hasError ? showError : false;
        }
        // enable login-button
        const isEnabled = !Object.keys(inputErrs).some(x => inputErrs[x]) && !Object.keys(charErrs).some(x => charErrs[x]);

/* ********************************************************* RETURN ********************************************************* */
        return (
            <Fragment>
                <PopUpModal
                    className={this.state.modalContent.class}
                    title={this.state.modalContent.title}                
                    show={this.state.showModal}
                    close={() => this.setState({showModal: false})}
                >
                    {this.state.modalContent.message}
                </PopUpModal>
                <Container className="px-4 px-sm-5 pt-5 mt-5">
                    <Row>
                        {/* <Col xs="12" sm={{size: 8, offset: 2}} lg={{size: 6, offset: 3}} xl={{size: 4, offset: 4}}> */}
                        <Col>
                            <h1 className="text-trans mb-4">Registration</h1>
                            <p className="text-trans mb-4">You are only one step away from your smart garden.</p>
                        </Col>
                    </Row>
                    <Form className="pb-md-0 pb-5">
                        <Row sm="2">
                            <Col xs="12" sm="6">
                                <FormGroup className="text-left mb-1">
                                    <Label className="w-100 h5 text-trans mb-2 ml-2">First Name:</Label>
                                    <Input
                                        className={"badge-pill bg-transparent " + (markInpError('firstName') || markCharError('firstName') ? "error" : "")}
                                        type="text"
                                        placeholder="Enter your first name"
                                        value={this.state.firstName}
                                        onChange={e => this.setState({firstName: e.target.value})}
                                        onBlur={this.handleBlur('firstName')}
                                        required
                                    />
                                </FormGroup>
                                <p className="error mb-2 ml-2">
                                    &nbsp;
                                    {
                                        this.state.firstName.trim() === ''
                                    ?
                                        markInpError('firstName') ? "Please enter your first name." : ""
                                    :
                                        markCharError('firstName') ? "Please use only letters seperated by dot, hyphen or space." : ""
                                    }
                                </p>
                            </Col>
                            <Col xs="12" sm="6">
                                <FormGroup className="text-left mb-1">
                                    <Label className="w-100 h5 text-trans mb-2 ml-2">Last Name:</Label>
                                    <Input
                                        className={"badge-pill bg-transparent " + (markInpError('lastName') || markCharError('lastName') ? "error" : "")}
                                        type="text"
                                        placeholder="Enter your last name"
                                        value={this.state.lastName}
                                        onChange={e => this.setState({lastName: e.target.value})}
                                        onBlur={this.handleBlur('lastName')}
                                        required
                                    />
                                </FormGroup>
                                <p className="error mb-2 ml-2">
                                    &nbsp;
                                    {
                                        this.state.lastName.trim() === ''
                                    ?
                                        markInpError('lastName') ? "Please enter your last name." : ""
                                    :
                                        markCharError('lastName') ? "Please use only letters seperated by dot, hyphen or space." : ""
                                    }
                                </p>
                            </Col>
                            <Col xs="12" sm="6">
                                <FormGroup className="text-left mb-1">
                                    <Label className="w-100 h5 text-trans mb-2 ml-2">Email:</Label>
                                    <Input
                                        className={"badge-pill bg-transparent " + (markInpError('email') || markCharError('email') ? "error" : "")}
                                        type="email"
                                        placeholder="Enter your email"
                                        value={this.state.email}
                                        onChange={e => this.setState({email: e.target.value})}
                                        onBlur={this.handleBlur('email')}
                                        required
                                    />
                                </FormGroup>
                                <p className="error mb-2 ml-2">
                                    &nbsp;
                                    {
                                        this.state.email === ''
                                    ?
                                        markInpError('email') ? "Please enter your email." : ""
                                    :
                                        markCharError('email') ? "Please enter a valid email." : ""
                                    }
                                </p>
                            </Col>
                            <Col xs="12" sm="6">
                                <FormGroup className="text-left mb-1">
                                    <Label className="w-100 h5 text-trans mb-2 ml-2">User Name:</Label>
                                    <Input
                                        className={"badge-pill bg-transparent " + (markInpError('userName') || markCharError('userName') ? "error" : this.state.existUserName ? "error" : "")}
                                        type="text"
                                        placeholder="Enter an user name"
                                        value={this.state.userName}
                                        onChange={e => this.setState({userName: e.target.value}, this.checkExistence(e.target.value))}
                                        onBlur={this.handleBlur('userName')}
                                        required
                                    />
                                </FormGroup>
                                <p className="error mb-2 ml-2">
                                    &nbsp;
                                    {
                                        this.state.userName.trim() === ""
                                    ?
                                        markInpError('userName') ? "Please enter a user name." : ""
                                    :
                                        markCharError('userName') ? "Please use only letters, numbers and several charachters." : this.state.existUserName ? "The name already exists. Please choose another one." : ""
                                    }
                                </p>
                            </Col>
                            <Col xs="12" sm="6">
                                <FormGroup className="text-left mb-1">
                                    <Label className="w-100 h5 text-trans mb-2 ml-2">Password:</Label>
                                    <Input
                                        className={"badge-pill bg-transparent " + (markInpError('password') ? "error" : "")}
                                        type="password"
                                        placeholder="Enter a password"
                                        value={this.state.password}
                                        onChange={e => this.setState({password: e.target.value})}
                                        onBlur={this.handleBlur('password')}
                                        required
                                    />
                                </FormGroup>
                                <p className="error mb-2 ml-2">&nbsp;{markInpError('password') ? "Please enter a password." : ""}</p>
                            </Col>
                            <Col xs="12" sm="6">
                                <FormGroup className="text-left mb-1">
                                    <Label className="w-100 h5 text-trans mb-2 ml-2">Repeat Password:</Label>
                                    <Input
                                        className={"badge-pill bg-transparent " + (markInpError('repassword') ? "error" : "")}
                                        type="password"
                                        placeholder="Repeat your password"
                                        value={this.state.repassword}
                                        onChange={e => this.setState({repassword: e.target.value})}
                                        onBlur={this.handleBlur('repassword')}
                                        required
                                    />
                                </FormGroup>
                                <p className="error mb-2 ml-2">&nbsp;{markInpError('repassword') ? "Please repeat the password." : ""}</p>
                            </Col>
                            <Col xs="12" sm="6">
                                <h5 className="text-trans mt-2">
                                    Already registered?&nbsp;
                                    <Link to="/login">Login</Link>
                                </h5>
                            </Col>
                        </Row>
                        <Col className="text-center">
                            <Button className="badge-pill btn-outline-light bg-transparent my-4" onClick={this.onRegisterBtnClick} disabled={!isEnabled}>
                                Register
                            </Button>
                        </Col>
                    </Form>
                </Container>
            </Fragment>
        );
    }
};

/* ********************************************************* EXPORT ********************************************************* */
export default connect(null, {setBackgroundImageAction, setBackgroundColor1Action, setBackgroundColor5Action})(Register);
