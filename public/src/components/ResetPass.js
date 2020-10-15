import React, {useState} from 'react';
import {
  InputGroup,
  Button,
  Input,
  Container
} from 'reactstrap';
// import {Link, useHistory} from 'react-router-dom';
import PopUpModal from './PopUpModal';
import {sendResetLink} from '../services/api';

const ResetPass = (props) => {

//   const history = useHistory()
  const initialState = {
    email: '',
    entriesError: false,
    errorElement: null,
    errorTitle: ''
  }
  const [myState, setMyState] = useState(initialState);

  const onSendBtnClick = (e) => {
    e.preventDefault()
    if (myState.email.trim() === '') {
      const errorElement = (
        <ul>
          {myState
            .email
            .trim() === ''
            ? <li>Please enter your Email , <br></br> Email should not be empty</li>
            : null}
        </ul>
      )
      setMyState({
        ...myState,
        entriesError: true,
        errorElement,
        errorTitle: 'Entries Error'
      })
    } else {
        sendResetLink(myState.email).then(data => {
        switch (data) {
          case 2:
            setMyState({...myState, entriesError: true, errorElement: <p>there was a server error</p>, errorTitle: 'Server Error' });
            break;
          case 4:
            setMyState({...myState, entriesError: true, errorElement: <p>the email that you used is not exist</p>, errorTitle: 'Email not exist' });
            break;
          case 1:
            // show admin panel
            // props.setUserAction(myState.email)
            setMyState({...myState, entriesError: true, errorElement: <p>We have sent you a reset email, <br></br> Check your Email </p>, errorTitle: 'Email not exist' });
            console.log('ok ok ok');
            break;
        
          default:
            break;
        }
      }).catch(error => {
        setMyState({...myState, entriesError: true, errorElement: <p>can not send the data</p>, errorTitle: 'unknown error' });
      })
    }
  };
  const closeModal = () => {
    setMyState({
      ...myState,
      entriesError: false
    })
  };

  //console.log(myState);

  return (
    <React.Fragment>
      <PopUpModal
        show={myState.entriesError}
        close={closeModal}
        className="bg-danger"
        title={myState.errorTitle}>
          {myState.errorElement}
        </PopUpModal>
      <Container>
          <h1>My Account / login</h1>
          <h3>Forget your password ??</h3>
          <p>
            Don't worry here you can easily reset it. <br/>
            Enter your email and you will receive a link where you can reset your password
          </p>
          <InputGroup className="mb-3">
                <div className="col-md-6">
                  <Input
                    type="email"
                    placeholder="Enter User Name"
                    required
                    onChange={(e) => {
                    setMyState({
                      ...myState,
                      email: e.target.value
                    })
                  }}
                    value={myState.email}/>
                  <span className="required-star">*</span>
                </div>
                <div className="col-md-4">
                  <Button className="btn black" onClick={onSendBtnClick}>Send</Button>
                </div>
          </InputGroup>
      </Container>
    </React.Fragment>
  )
}

export default ResetPass