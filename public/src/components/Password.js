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
// import {Link, useHistory} from 'react-router-dom';
import PopUpModal from './PopUpModal';
import {sendResetLink} from '../services/api';

const Password = props => {
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
        <Fragment>
            <PopUpModal show={myState.entriesError} close={closeModal} className="bg-danger" title={myState.errorTitle}>
                {myState.errorElement}
            </PopUpModal>
            <Container>
                <Col sm="12" md={{size: 6, offset: 3}}>
                    <h1 className="text-trans mb-4">Password</h1>
                    <p className="text-trans mb-4">Forgot your password? Enter your email to receive a link where you can reset your password.</p>
                </Col>
                <Form className="pb-md-0 pb-5">
                    <Row>
                        <Col sm="12" md={{size: 6, offset: 3}}>
                            <FormGroup className="mb-md-4 mb-3 text-left">
                                <Label className="w-100 h5 text-trans mb-2 ml-2">Email:</Label>
                                <Input
                                    className="badge-pill bg-transparent"
                                    type="email"
                                    placeholder="Enter your email"
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
                        <Col sm="12" className="text-center text-trans">
                            <Button className="badge-pill btn-outline-light bg-transparent mt-4" onClick={onSendBtnClick}>
                                Send
                            </Button>
                        </Col>
                    </Row>
                </Form>
            </Container>
        </Fragment>
    );
};

export default Password;
