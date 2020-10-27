import React, {Fragment, useState} from 'react';
import {Container,
        Row,
        Col,
        Form,
        FormGroup,
        Label,
        Input,
        Button
} from 'reactstrap';
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
                <p className="col-sm-12 col-md-6 offset-md-3 text-trans mb-4">login to start your devices management</p>
                <Form className="pb-md-0 pb-5">
                    <Row xs="1" sm="1">
                        <Col sm="12" md={{size: 6, offset: 3}}>
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
                        <Col sm="12" md={{size: 6, offset: 3}}>
                            <FormGroup className="mb-4 text-left">
                                <Row>
                                    <Col xs="4" md="6">
                                        <Label className="w-100 h5 text-trans mb-2 ml-2">Password:</Label>
                                    </Col>
                                    <Col xs="8" md="6" className="text-right">
                                        <span className="pr-2">Forgot Your <Link to="/Password" className="pr-1">Password</Link>?</span>
                                    </Col>
                                </Row>
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
                        <Col sm="12" md={{size: 6, offset: 3}}>
                            <h5>
                                Not Registered?	&nbsp;
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

// export default connect(null,{setUserAction})(Login)
export default Login;
