import React from "react";
import { InputGroup, Button, Input, Container } from "reactstrap";
import { Link } from "react-router-dom";
import PopUpModal from "./PopUpModal";
import validator from "validator";
import { registerPost } from "../services/api";

class Register extends React.Component {
 
  render() {
    return (
      <React.Fragment>
        <Container>
        <div>
            Sorry This Page Is Not Exist Make Sure That You Use The Right Link
        </div>
        </Container>
      </React.Fragment>
    );
  }
}
export default Register;
