import React, {Fragment, useState} from 'react';
import {Container, Row, Col, Form, FormGroup, Label, Input, Button} from 'reactstrap';
import {useParams, Link} from 'react-router-dom';
import PopUpModal from './PopUpModal';
import {resetPass} from '../services/api';

const Reset = () => {
    const params = useParams();

    // console.log(params.id / 135531);

    const initialState = {
        password: '',
        repassword: '',
        entriesError: false,
        errorElement: null,
        errorTitle: ''
    };
    const [myState, setMyState] = useState(initialState);

    const onConfirmBtnClick = e => {
        e.preventDefault();
        if (myState.password !== myState.repassword || myState.password.trim() === '') {
            const errorElement = (
                <ul>
                    {myState.password.trim() === '' ? (
                        <li>Please enter a password</li>
                    ) : null}
                    {myState.password !== myState.repassword ? (
                        <li>Passwords do not match</li>
                    ) : null}
                </ul>
            );
            setMyState({
                ...myState,
                entriesError: true,
                errorElement,
                errorTitle: 'Entry Error'
            });
        } else {
            resetPass(params.email, params.id, myState.password).then(data => {
                switch (data) {
                    case 1:
                        setMyState({
                            ...myState,
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
                        setMyState({
                            ...myState,
                            entriesError: true,
                            errorElement: <p>There was a server error</p>,
                            errorTitle: 'Server Error'
                        });
                        break;
                    case 4:
                        setMyState({
                            ...myState,
                            entriesError: true,
                            errorElement: <p>The email you have used does not exist</p>,
                            errorTitle: 'Email Does Not Exist'
                        });
                        break;
                    default:
                        break;
                }
            }).catch(error => {
                setMyState({
                    ...myState,
                    entriesError: true,
                    errorElement: <p>Can not send the data</p>,
                    errorTitle: 'Unknown Error'
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
                                    onChange={e => {
                                        setMyState({
                                            ...myState,
                                            password: e.target.value
                                        });
                                    }}
                                    value={myState.password}
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
                                    onChange={e => {
                                        setMyState({
                                            ...myState,
                                            repassword: e.target.value
                                        });
                                    }}
                                    value={myState.repassword}
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

export default Reset;

// import React, {useEffect, useState} from 'react';
// import {useParams, Link, useHistory} from 'react-router-dom';

// import {sendParams} from '../services/api';

// const resetPage = () => {
//     const params = useParams();
//     const history = useHistory();

//     useEffect(() => {
//         sendParams(params.email)
//             .then(data => {
//                 console.log(data);
//                 if (data !== 2) {
//                     history.push('/login');
//                 } else {
//                     history.push('/register');
//                 }
//             })
//             .catch(err => {
//                 history.push('/register');
//             });
//     }, []);

//     return (
//         <React.Fragment>
//             <div className="breadcrumb">
//                 <p>Thanks For Your Register</p>
//                 <div className="container">
//                     <Link className="breadcrumb-item" to="/login">
//                         Login
//                     </Link>
//                 </div>
//             </div>
//         </React.Fragment>
//     );
// };

// export default resetPage;
