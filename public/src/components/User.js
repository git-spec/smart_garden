// export default Register;
import React, { Fragment, useState, useEffect, useRef } from "react";
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
// import { getData } from "../services/getData";
// import { Link, useLocation, useHistory } from "react-router-dom";
import PopUpModal from "./PopUpModal";
// import validator from "validator";
import { editPost, getUser } from "../services/api";

import { connect } from "react-redux";

const User = (props) => {
    
    useEffect(() => {
        getUser(props.user.id).then(user => {
            setMyState({...myState,firstName: user.firstname, lastName: user.lastname, userName: user.username, city: user.city})
        }).catch(err=>{
            console.log(err);
        })
    // eslint-disable-next-line
    },[]);
    const imagesFileInpRef = useRef();


    const user = { ...props.user };
    // const firstName = user.firstName
    // const lastName = user.lastName
    // const userName = user.userName
    // console.log(user.firstName);
    // console.log('location.state '+location.state);
    // if(!location.state){
    //     history.push('/login')
    // }
    const initialState = {
        firstName: '',
        lastName: '',
        userName: '',
        city: "",
        password: "",
        repassword: "",
        errorComponent: null,
        showErrorModal: false,
        resultElement: null,
    };
    const [myState, setMyState] = useState(initialState);
    // setMyState({...myState,firstName: user.firstName, lastName: user.lastName, userName: user.userName})
    // if (myState.firstName.trim() === "") {
    //     setMyState({...myState,firstName: user.firstName })
    // }
    // if (myState.lastName.trim() === "") {
    //     setMyState({...myState,lastName: user.lastName })
    // }
    // if (myState.userName.trim() === "") {
    //     setMyState({...myState,userName: user.userName })
    // }

    const onEditBtnClick = (e) => {
        console.log(initialState);
        e.preventDefault();
        if (
            myState.password !== myState.repassword
        ) {
            const errorsElement = (

                <ul>
                    <br/>
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
                // imagesFileInpRef.current.files.length ?
                // imagesFileInpRef.current.files : null
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
                        ...myState,
                        resultElement: badge,
                    });
                })
                .catch((err) => {
                    console.log(err);
                    console.log({
                        a: user.id,
                        b: myState.firstName,
                        c: myState.lastName,
                        d: myState.userName,
                        e: myState.City,
                        f: myState.password,
                        g: myState.repassword,
                    });
                    const badge = (
                        <div className="alert alert-danger" role="alert">
                            can not send the data to server
                        </div>
                    );
                    setMyState({
                        ...myState,
                        resultElement: badge,
                    });
                });
        }
    };

    const closeModal = () => {
        setMyState({
            ...myState,
            showErrorModal: false,
        });
    };
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
                        <h1 className="text-trans mb-4">
                            Hello {user.firstName + " " + user.lastName}
                        </h1>
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
                            src={require("../imgs/1.jpg")}
                            height={"150px"}
                            width={"150px"}
                            roundedCircle
                        />
                        <br />
                        <br />
                        <Input
                            ref={imagesFileInpRef}
                            id="exampleFormControlFile1"
                            type="file"
                            className="form-control-file"
                            multiple
                            accept="image/x-png,image/gif,image/jpeg"
                        />
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
                                    placeholder={myState.firstName}
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
                                    placeholder={myState.lastName}
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
                                    placeholder={myState.city?myState.city:"Enter Your City"}
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
                                    placeholder={myState.userName}
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
                                    placeholder="Write a New Password if you wont to change it"
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
};

const mapStateToProps = (state) => {
    return { user: state.user };
};
export default connect(mapStateToProps)(User);
