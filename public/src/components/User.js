// export default Register;
import React, { 
    Fragment, 
    useState, 
    // useEffect 
} from "react";
import {
    Container,
    Row,
    Col,
    Button,
    // Collapse,
    // Card,
    // CardBody,
    Input,
    Form,
    Label,
    FormGroup,
} from "reactstrap";
import Image from "react-bootstrap/Image";
import { 
    Link, 
    // useLocation, 
    // useHistory 
} from "react-router-dom";
import PopUpModal from "./PopUpModal";
// import validator from "validator";
import { editPost } from "../services/api";

import {connect} from 'react-redux'

const User = (props) => {
    // const location = useLocation()
    // const history = useHistory()
    const user = {...props.user}
    // console.log(props.user);
    // console.log('location.state '+location.state);
    // if(!location.state){
    //     history.push('/login')
    // }
    const initialState = {
        firstName: "",
        lastName: "",
        userName: "",
        City: "",
        password: "",
        repassword: "",
        errorComponent: null,
        showErrorModal: false,
        resultElement: null,
    };
    const [myState, setMyState] = useState(initialState);

    const onEditBtnClick = (e) => {
        e.preventDefault();
        if (
            myState.firstName.trim() === "" ||
            myState.lastName.trim() === "" ||
            myState.userName.trim() === "" ||
            myState.password === "" ||
            myState.password !== myState.repassword 
        ) {
            const errorsElement = (
                <ul>
                    {myState.firstName.trim() === "" ? (
                        <li>Please Enter your first name</li>
                    ) : null}
                    {myState.lastName.trim() === "" ? (
                        <li>Please Enter your last name</li>
                    ) : null}
                    {myState.userName.trim() === "" ? (
                        <li>user name should not be empty</li>
                    ) : null}
                    {myState.password === "" ? (
                        <li>password should not be empty</li>
                    ) : null}
                    {myState.password !== myState.repassword ? (
                        <li>password is not matching the repassword</li>
                    ) : null}
                </ul>
            );

            setMyState({
                ...myState,
                errorComponent: errorsElement,
                showErrorModal: true,
            });
        } else {
            editPost(
                user.id,
                myState.firstName,
                myState.lastName,
                myState.userName,
                myState.City,
                myState.password,
                myState.repassword
            )
                .then((data) => {
                    let badgeClass = "";
                    let badgeMessage = "";

                    switch (data) {
                        case 1:
                            badgeClass = "alert alert-success";
                            badgeMessage =
                                "You changed your Profile successfully";
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
                                "there is already a user with the same email / Username, please choose another email";
                            break;
                        default:
                            break;
                    }
                    const badge = (
                        <div className={badgeClass} role="alert">
                            {badgeMessage}
                        </div>
                    );
                    setMyState({
                        ...myState, resultElement: badge });
                })
                .catch((error) => {
                    const badge = (
                        <div className="alert alert-danger" role="alert">
                            can not send the registration data to server
                        </div>
                    );
                    setMyState({
                        ...myState, resultElement: badge });
                });
        }
    };

    const closeModal = () => {
        setMyState({
            ...myState, showErrorModal: false });
    };
    // console.log(state.feed); fluid public/src/images/FB_IMG_1592363046509.png
        return (
            <Fragment>
                <PopUpModal
                    show={myState.showErrorModal}
                    close={closeModal}
                    className="bg-danger"
                    title="Entries Error"
                >
                    {myState.errorComponent}
                </PopUpModal>

                <Container>
                    <Row>
                        <Col xs={6} md={9}>
                            <br />
        <h1 className="text-trans mb-4">Hello {user.firstName+' '+user.lastName}</h1>
                            <h3 className="text-trans mb-4">
                                {" "}
                                Welcome In Your Page
                            </h3>
                            <br />
                            <p className="text-trans mb-4">
                                Here you can easily edit your Profile
                            </p>
                        </Col>

                        <Col className="float-right" xs={6} md={3}>
                            <Image
                                src={require("./1.jpg")}
                                height={"150px"}
                                width={"150px"}
                                roundedCircle
                                alt={<Link to="/register">Add Your Photo</Link>}
                            />
                            <br />
                            <br />
                            <Button> Add a New Photo</Button>
                        </Col>
                    </Row>
                    <Row></Row>
                    <Form className="pb-md-0 pb-5">
                        <div className="col-lg-12 col-md-12">
                            {myState.resultElement}
                        </div>
                        <Row xs="1" sm="2">
                            <Col>
                                <FormGroup className="mb-md-4 mb-3 text-left">
                                    <Label className="w-100 h5 text-trans mb-2 ml-2">
                                        First Name:
                                    </Label>
                                    <Input
                                        className="badge-pill text-trans bg-transparent"
                                        type="text"
                                        placeholder={user.firstName}
                                        required
                                        onChange={(e) => {
                                            setMyState({
                                            ...myState,
                                                firstName: e.target.value,
                                            });
                                        }}
                                        value={myState.firstName}
                                    />
                                </FormGroup>
                            </Col>
                            <Col>
                                <FormGroup className="mb-4 text-left">
                                    <Label className="w-100 h5 text-trans mb-2 ml-2">
                                        Last Name:
                                    </Label>
                                    <Input
                                        className="badge-pill bg-transparent"
                                        type="text"
                                        placeholder={user.lastName}
                                        required
                                        onChange={(e) => {
                                            setMyState({
                                            ...myState,
                                                lastName: e.target.value,
                                            });
                                        }}
                                        value={myState.lastName}
                                    />
                                </FormGroup>
                            </Col>
                            <Col>
                                <FormGroup className="mb-4 text-left">
                                    <Label className="w-100 h5 text-trans mb-2 ml-2">
                                        City:
                                    </Label>
                                    <Input
                                        className="badge-pill bg-transparent"
                                        type="city"
                                        placeholder="Enter Your City"
                                        required
                                        onChange={(e) => {
                                            setMyState({
                                            ...myState,
                                                City: e.target.value,
                                            });
                                        }}
                                        value={myState.City}
                                    />
                                </FormGroup>
                            </Col>
                            <Col>
                                <FormGroup className="mb-4 text-left">
                                    <Label className="w-100 h5 text-trans mb-2 ml-2">
                                        User Name:
                                    </Label>
                                    <Input
                                        className="badge-pill bg-transparent"
                                        type="text"
                                        placeholder={user.userName}
                                        required
                                        onChange={(e) => {
                                            setMyState({
                                            ...myState,
                                                userName: e.target.value,
                                            });
                                        }}
                                        value={myState.userName}
                                    />
                                </FormGroup>
                            </Col>
                            <Col>
                                <FormGroup className="mb-4 text-left">
                                    <Label className="w-100 h5 text-trans mb-2 ml-2">
                                       Change Password:
                                    </Label>
                                    <Input
                                        className="badge-pill bg-transparent"
                                        type="password"
                                        placeholder="Write a New Password"
                                        required
                                        onChange={(e) => {
                                            setMyState({
                                            ...myState,
                                                password: e.target.value,
                                            });
                                        }}
                                        value={myState.password}
                                    />
                                </FormGroup>
                            </Col>
                            <Col>
                                <FormGroup className="mb-3 text-left">
                                    <Label className="w-100 h5 text-trans mb-2 ml-2">
                                        Repeat Password:
                                    </Label>
                                    <Input
                                        className="badge-pill bg-transparent"
                                        type="password"
                                        placeholder="Repeat Password"
                                        required
                                        onChange={(e) => {
                                            setMyState({
                                            ...myState,
                                                repassword: e.target.value,
                                            });
                                        }}
                                        value={myState.repassword}
                                    />
                                </FormGroup>
                            </Col>
                        </Row>
                        <Col className=" text-center">
                            <Button
                                className="badge-pill btn-outline-light bg-transparent my-4"
                                onClick={onEditBtnClick}
                            >
                                Edit
                            </Button>
                        </Col>
                    </Form>
                </Container>
            </Fragment>
        );
    }

const mapStateToProps = state => {
    return {user: state.user}
}

// export default User;
  export default connect(mapStateToProps)(User)
