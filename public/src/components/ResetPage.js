import React, {useState} from 'react';
import {Container, Row, Col, Form, FormGroup, Label, Input, Button} from 'reactstrap';
import {useParams, Link} from 'react-router-dom';
import PopUpModal from './PopUpModal';
import {resetPass} from '../services/api';

const ResetPage = () => {
    const params = useParams();

    console.log(params.email);
    console.log(params.id / 135531);

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
                        <li>
                            Password is empty <br></br> please make sure that you use a valid Password
                        </li>
                    ) : null}
                    {myState.password !== myState.repassword ? (
                        <li>
                            Password didn't match Repassword, <br></br> Please Be Sure That Password and Repassword is
                            matching each other
                        </li>
                    ) : null}
                </ul>
            );
            setMyState({
                ...myState,
                entriesError: true,
                errorElement,
                errorTitle: 'Entries Error'
            });
        } else {
            resetPass(params.email, params.id, myState.password)
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
                        case 4:
                            setMyState({
                                ...myState,
                                entriesError: true,
                                errorElement: <p>the email that you used is not exist</p>,
                                errorTitle: 'Email not exist'
                            });
                            break;
                        case 1:
                            setMyState({
                                ...myState,
                                entriesError: true,
                                errorElement: (
                                    <p> 
                                        We have reset your password, <br></br> tray to login from{' '}
                                        <Link className="breadcrumb-item" to="/login">
                                            {' '}
                                            here{' '}
                                        </Link>{' '}
                                    </p>
                                ),
                                errorTitle: 'Password is successfully changed'
                            });
                            console.log('ok ok ok');
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

    return (
        <React.Fragment>
            <PopUpModal show={myState.entriesError} close={closeModal} className="bg-danger" title={myState.errorTitle}>
                {myState.errorElement}
            </PopUpModal>
            <Container className="mt-5 pt-5">
                <h1 className="text-trans mb-4">My Account /Reset Password</h1> <br />
                <h3 className="text-trans mb-4">Please Enter The New Password</h3> <br />
                <Form className="text-center pb-md-0 pb-5">
                <Col>
                        <Input
                            className="badge-pill bg-transparent"
                            type="password"
                            placeholder="Enter New Password"
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
                        <Input
                            className="badge-pill bg-transparent"
                            type="password"
                            placeholder="Repeat Password"
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
                        <Col>
                        <Button className="badge-pill btn-outline-light bg-transparent mt-8" onClick={onConfirmBtnClick}>
                            Confirm
                        </Button>
                        </Col>
                </Form>
            </Container>
        </React.Fragment>
    );
};

export default ResetPage;

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
