// import React from 'react';
// import {Container, Row, Col, Form, FormGroup, Label, Input, Button} from 'reactstrap';

// export default Register;
import React from "react";
import { InputGroup, Button, Input, Container } from "reactstrap";
import { Link } from "react-router-dom";
import PopUpModal from "./PopUpModal";
import validator from "validator";
import { registerPost } from "../services/api";
class Register extends React.Component {
  state = {
    firstName: "",
    lastName: "",
    userName: "",
    email: "",
    password: "",
    repassword: "",
    errorComponent: null,
    showErrorModal: false,
    resultElement: null,
  };

  onRegisterBtnClick = (e) => {
    e.preventDefault();
    if (
      this.state.firstName.trim() === "" ||
      this.state.lastName.trim() === "" ||
      this.state.userName.trim() === "" ||
      this.state.email.trim() === "" ||
      this.state.password === "" ||
      this.state.password !== this.state.repassword ||
      !validator.isEmail(this.state.email.trim())
    ) {
      const errorsElement = (
        <ul>
          {this.state.firstName.trim() === "" ? (
            <li>Please Enter your first name</li>
          ) : null}
          {this.state.lastName.trim() === "" ? (
            <li>Please Enter your last name</li>
          ) : null}
          {this.state.userName.trim() === "" ? (
            <li>user name should not be empty</li>
          ) : null}
          {this.state.email.trim() === "" ? (
            <li>Email should not be empty</li>
          ) : null}
          {!validator.isEmail(this.state.email.trim()) ? (
            <li>you have to enter a valid email</li>
          ) : null}
          {this.state.password === "" ? (
            <li>password should not be empty</li>
          ) : null}
          {this.state.password !== this.state.repassword ? (
            <li>password is not matching the repassword</li>
          ) : null}
        </ul>
      );

      this.setState({ errorComponent: errorsElement, showErrorModal: true });
    } else {
      registerPost(
        this.state.firstName,
        this.state.lastName,
        this.state.userName,
        this.state.email,
        this.state.password,
        this.state.repassword
      )
        .then((data) => {
          let badgeClass = "";
          let badgeMessage = "";

          switch (data) {
            case 1:
              badgeClass = "alert alert-success";
              badgeMessage = "You register successfully, you can login now";
              break;
            case 2:
            case 4:
              badgeClass = "alert alert-danger";
              badgeMessage =
                "there was a server side error, please contact the administrator";
              break;
            case 3:
              badgeClass = "alert alert-danger";
              badgeMessage =
                "there is already a user with the same email, please choose another email";
              break;
            default:
              break;
          }
          const badge = (
            <div className={badgeClass} role="alert">
              {badgeMessage}
            </div>
          );
          this.setState({ resultElement: badge });
        })
        .catch((error) => {
          const badge = (
            <div className="alert alert-danger" role="alert">
              can not send the registration data to server
            </div>
          );
          this.setState({ resultElement: badge });
        });
    };
  };

  closeModal = () => {
    this.setState({ showErrorModal: false });
  };
  render() {
    return (
      <React.Fragment>
        <PopUpModal
          show={this.state.showErrorModal}
          close={this.closeModal}
          className="bg-danger"
          title="Entries Error"
        >
          {this.state.errorCompenent}
        </PopUpModal>

        <Container>
          <div className="container">
            <h1>My Account / Register</h1>
            <p>Welcome in the Smart Garden here you will live the future</p>
          </div>
          <InputGroup className="mb-3">
            <div className="col-lg-12 col-md-12">
              {this.state.resultElement}
            </div>
            <div className="col-md-4">
              <Input
                type="text"
                placeholder="Enter Your first Name"
                required
                onChange={(e) => {
                  this.setState({ firstName: e.target.value });
                }}
                value={this.state.firstName}
              />
              {/* <span className="required-star">*</span> */}
            </div>
            <div className="col-md-4">
              <Input
                type="text"
                placeholder="Enter Your last Name"
                required
                onChange={(e) => {
                  this.setState({ lastName: e.target.value });
                }}
                value={this.state.lastName}
              />
              {/* <span className="required-star">*</span> */}
            </div>
            <div className="col-md-4">
              <Input
                type="text"
                placeholder="Enter User Name"
                required
                onChange={(e) => {
                  this.setState({ userName: e.target.value });
                }}
                value={this.state.userName}
              />
              {/* <span className="required-star">*</span> */}
            </div>
            <div className="col-md-4">
              <Input
                type="email"
                placeholder="Enter User Mail"
                required
                onChange={(e) => {
                  this.setState({ email: e.target.value });
                }}
                value={this.state.email}
              />
              {/* <span className="required-star">*</span> */}
            </div>
            <div className="col-md-4">
              <Input
                type="password"
                placeholder="Password"
                required
                onChange={(e) => {
                  this.setState({ password: e.target.value });
                }}
                value={this.state.password}
              />
              {/* <span className="required-star">*</span> */}
            </div>
            <div className="col-md-4">
              <Input
                type="password"
                placeholder="Repeat Password"
                required
                onChange={(e) => {
                  this.setState({ repassword: e.target.value });
                }}
                value={this.state.repassword}
              />
              {/* <span className="required-star">*</span> */}
            </div>
            <div className="col-lg-8 col-md-12">
              <Button color="secondary" onClick={this.onRegisterBtnClick}>
                Register
              </Button>
              <h5>
                not Registered?
                <Link to="/login">Login here</Link>
              </h5>
            </div>
          </InputGroup>
        </Container>
      </React.Fragment>
    );
  }
}
// function Register() {
//     return(
//         <Container className="mt-5 pt-5">
//             <h1 className="text-trans mb-4">Register</h1>
//             <Form className="text-center pb-md-0 pb-5">
//                 <Row xs="1" sm="2">
//                     <Col>
//                         <FormGroup className="mb-md-4 mb-3 text-left">
//                             <Label className="w-100 h5 text-trans mb-2 ml-2">First Name:</Label>
//                             <Input className="badge-pill bg-transparent" placeholder="First Name" />
//                         </FormGroup>
//                     </Col>
//                     <Col>
//                         <FormGroup className="mb-4 text-left">
//                             <Label className="w-100 h5 text-trans mb-2 ml-2">Last Name:</Label>
//                             <Input className="badge-pill bg-transparent" placeholder="Last Name" />
//                         </FormGroup>
//                     </Col>
//                     <Col>
//                         <FormGroup className="mb-4 text-left">
//                             <Label className="w-100 h5 text-trans mb-2 ml-2">Email:</Label>
//                             <Input className="badge-pill bg-transparent" placeholder="Email" />
//                         </FormGroup>
//                     </Col>
//                     <Col>
//                         <FormGroup className="mb-4 text-left">
//                             <Label className="w-100 h5 text-trans mb-2 ml-2">User Name:</Label>
//                             <Input className="badge-pill bg-transparent" placeholder="User Name" />
//                         </FormGroup>
//                     </Col>
//                     <Col>
//                         <FormGroup className="mb-4 text-left">
//                             <Label className="w-100 h5 text-trans mb-2 ml-2">Password:</Label>
//                             <Input className="badge-pill bg-transparent" placeholder="Password" />
//                         </FormGroup>
//                     </Col>
//                     <Col>
//                         <FormGroup className="mb-3 text-left">
//                             <Label className="w-100 h5 text-trans mb-2 ml-2">Repeat Password:</Label>
//                             <Input className="badge-pill bg-transparent" placeholder="Repeat Password" />
//                         </FormGroup>
//                     </Col>
//                 </Row>
//                 <Button className="badge-pill btn-outline-light bg-transparent mt-4">SEND</Button>
//             </Form>
//         </Container>
//     );
// }

export default Register;
