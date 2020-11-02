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
import PopUpModal from './PopUpModal';
import {sendResetLink} from '../services/api';

const Password = props => {

    const initialState = {
        email: '',
        entriesError: false,
        errorElement: null,
        errorTitle: '',
        modalClass: ''
    };
    const [myState, setMyState] = useState(initialState);

    const onSendBtnClick = e => {
        e.preventDefault();
        if (myState.email.trim() === '') {
            const errorElement = (
                <ul>
                    {myState.email.trim() === '' ? <li>Please enter your email</li> : null}
                </ul>
            );
            setMyState({
                ...myState,
                entriesError: true,
                errorTitle: 'Entry Error',
                errorElement,
                modalClass: 'bg-danger'
            });
        } else {
            sendResetLink(myState.email).then(data => {
                switch (data) {
                    case 1:
                        setMyState({
                            ...myState,
                            entriesError: true,
                            errorTitle: 'Reset Email Sent',
                            errorElement: <p>We have sent you a reset email,<br/>please check your emails!</p>,
                            modalClass: 'bg-success'
                        });
                        break;
                    case 2:
                        setMyState({
                            ...myState,
                            entriesError: true,
                            errorTitle: 'Server Error',
                            errorElement: <p>There was a server error</p>,
                            modalClass: 'bg-danger'
                        });
                        break;
                    case 4:
                        setMyState({
                            ...myState,
                            entriesError: true,
                            errorTitle: 'Email Does Not Exist',
                            errorElement: <p>The email you have used does not exist</p>,
                            modalClass: 'bg-danger'
                        });
                        break;
                    default:
                        break;
                }
            }).catch(error => {
                setMyState({
                    ...myState,
                    entriesError: true,
                    errorTitle: 'Unknown Error',
                    errorElement: <p>Can not send the data</p>,
                    modalClass: 'bg-danger'
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
            <PopUpModal show={myState.entriesError} close={closeModal} className={myState.modalClass} title={myState.errorTitle}>
                {myState.errorElement}
            </PopUpModal>
            <Container>
                <Col sm="12" md={{size: 6, offset: 3}}>
                    <h1 className="text-trans mb-4">Password</h1>
                    <p className="text-trans mb-4">Forgot your password? Enter your email address to receive a link to reset it.</p>
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