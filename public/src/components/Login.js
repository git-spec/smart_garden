import React, {useState} from 'react';
import {Container, Row, Col, Form, FormGroup, Label, Input, Button} from 'reactstrap';
import {Link, useHistory} from 'react-router-dom';
// import {connect} from 'react-redux'

import PopUpModal from './PopUpModal';
import {loginPost} from '../services/api';
// import {setUserAction} from '../actions'

const Login = props => {
    // useEffect(() => {
    //   props.setUserAction(null)

    // }, []);

    const history = useHistory();
    const initialState = {
        email: '',
        password: '',
        entriesError: false,
        errorElement: null,
        errorTitle: ''
    };
    const [myState, setMyState] = useState(initialState);

    const onLoginBtnClick = e => {
        e.preventDefault();
        if (myState.email.trim() === '' || myState.password === '') {
            const errorElement = (
                <ul>
                    {myState.email.trim() === '' ? <li>Email should not be empty</li> : null}
                    {myState.password === '' ? <li>Password should not be empty</li> : null}
                </ul>
            );
            setMyState({
                ...myState,
                entriesError: true,
                errorElement,
                errorTitle: 'Entries Error'
            });
        } else {
            loginPost(myState.email, myState.password)
                .then(data => {
                    switch (data) {
                        case 2:
                            setMyState({
                                ...myState,
                                entriesError: true,
                                errorElement: <p>there was a server error</p>,
                                errorTitle: 'Server Error'
                            });
                            break;
                        case 3:
                            setMyState({
                                ...myState,
                                entriesError: true,
                                errorElement: <p>Password is wrong</p>,
                                errorTitle: 'Wrong password'
                            });
                            break;
                        case 4:
                            setMyState({
                                ...myState,
                                entriesError: true,
                                errorElement: <p>the email that you used is not exist</p>,
                                errorTitle: 'Email not exist'
                            });
                            break;
                        case 1:
                            // show admin panel
                            // props.setUserAction(myState.email)
                            history.push('/user');
                            // console.log('ok ok ok');
                            break;
                        default:
                            break;
                    }
                })
                .catch(error => {
                    setMyState({
                        ...myState,
                        entriesError: true,
                        errorElement: <p>can not send the data</p>,
                        errorTitle: 'unknown error'
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

    //console.log(myState);

    return (
        <React.Fragment>
            <PopUpModal show={myState.entriesError} close={closeModal} className="bg-danger" title={myState.errorTitle}>
                {myState.errorElement}
            </PopUpModal>
            <Container className="mt-5 pt-5">
                {/* <div className="breadcrumb">
          <div className="container">
            <Link className="breadcrumb-item" to="/">Home</Link>
            <span className="breadcrumb-item active">Login</span>
          </div>
        </div> */}
                <h1 className="text-trans mb-4">My Account / login</h1>
                <p className="text-trans mb-4">login to start your devices management</p>
                <Form className="text-center pb-md-0 pb-5">
                    <Row xs="1" sm="1">
                        <Col>
                            <FormGroup className="mb-md-4 mb-3 text-left">
                                <Label className="w-100 h5 text-trans mb-2 ml-2">First Name:</Label>
                                <Input
                                    className="badge-pill bg-transparent"
                                    type="email"
                                    placeholder="Enter User Name"
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
                        <Col>
                            <FormGroup className="mb-4 text-left">
                                <Label className="w-100 h5 text-trans mb-2 ml-2">Password:</Label>
                                <Input
                                    className="badge-pill bg-transparent"
                                    type="password"
                                    placeholder="Password"
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
                    </Row>
                </Form>
                <Col  className="text-trans mb-4">
                    <Button className="badge-pill btn-outline-light bg-transparent mt-4" onClick={onLoginBtnClick}>
                        Login
                    </Button>
                </Col>
                <Col  className="text-trans mb-4">
                    <h5>
                        Not Registered?
                        <Link to="/register"> register here</Link>
                    </h5>
                </Col>
                <Col  className="text-trans mb-4">
                    <h5>
                    Forgot Your <Link to="/resetPass"> Password?</Link>
                    </h5>
                </Col>
            </Container>
        </React.Fragment>
    );
};

// export default connect(null,{setUserAction})(Login)
export default Login;
