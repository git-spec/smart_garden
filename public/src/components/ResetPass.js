import React, {useState} from 'react';
import {
    Container, 
    // Row, 
    Col, 
    Form, 
    FormGroup, 
    Label, 
    Input, 
    Button
} from 'reactstrap';
// import {Link, useHistory} from 'react-router-dom';
import PopUpModal from './PopUpModal';
import {sendResetLink} from '../services/api';

const ResetPass = props => {
    //   const history = useHistory()
    const initialState = {
        email: '',
        entriesError: false,
        errorElement: null,
        errorTitle: ''
    };
    const [myState, setMyState] = useState(initialState);

    const onSendBtnClick = e => {
        e.preventDefault();
        if (myState.email.trim() === '') {
            const errorElement = (
                <ul>
                    {myState.email.trim() === '' ? (
                        <li>
                            Please enter your Email , <br></br> Email should not be empty
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
            sendResetLink(myState.email)
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
                            // show admin panel
                            // props.setUserAction(myState.email)
                            setMyState({
                                ...myState,
                                entriesError: true,
                                errorElement: (
                                    <p>
                                        We have sent you a reset email, <br></br> Check your Email{' '}
                                    </p>
                                ),
                                errorTitle: 'Email not exist'
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

    //console.log(myState);

    return (
        <React.Fragment>
            <PopUpModal show={myState.entriesError} close={closeModal} className="bg-danger" title={myState.errorTitle}>
                {myState.errorElement}
            </PopUpModal>
            <Container className="mt-5 pt-5">
                <h1 className="text-trans mb-4">My Account / login</h1>
                <h3 className="text-trans mb-4">Forget your password ??</h3>
                <p className="text-trans mb-4">
                    Don't worry here you can easily reset it. <br />
                    Enter your email and you will receive a link where you can reset your password
                </p>
                <Form className="text-center pb-md-0 pb-5">
                    <Col>
                        <FormGroup className="mb-md-4 mb-3 text-left">
                            <Label className="w-100 h5 text-trans mb-2 ml-2">First Name:</Label>
                            <Input
                                className="badge-pill bg-transparent"
                                type="email"
                                placeholder="Enter User Email"
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
                    <Button className="badge-pill btn-outline-light bg-transparent mt-4" onClick={onSendBtnClick}>
                        Send
                    </Button>
                </Form>
            </Container>
        </React.Fragment>
    );
};

export default ResetPass;
