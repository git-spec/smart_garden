// export default Register;
import React, {useState, useEffect, useRef} from "react";
import {
    Container,
    Row,
    Col,
    Button,
    Input,
    Form,
    Label,
    FormGroup,
    Breadcrumb,
    BreadcrumbItem
} from "reactstrap";
// components
import { Link } from "react-router-dom";
import Image from "react-bootstrap/Image";
import PopUpModal from "./PopUpModal";
import { editPost, getUser } from "../services/api";
// redux
import {connect} from 'react-redux';
import {setBackgroundColor5Action,
        setBackgroundColor1Action
} from '../actions';


const User = (props) => {
    useEffect(() => {

        props.setBackgroundColor1Action("color-1");
        props.setBackgroundColor5Action(null);

        getUser(props.user.id)
            .then((user) => {
                if (user.img) {
                    setMyState({
                        ...myState,
                        firstName: user.firstname,
                        lastName: user.lastname,
                        userName: user.username,
                        city: user.city,
                        userImg: user.img,
                    });
                } else {
                    setMyState({
                        ...myState,
                        firstName: user.firstname,
                        lastName: user.lastname,
                        userName: user.username,
                        city: user.city,
                    });
                }
            })
            .catch((err) => {
                console.log(err);
            });
        // eslint-disable-next-line
    }, []);
    const imageInpRef = useRef();

    const user = { ...props.user };
    const initialState = {
        firstName: "",
        lastName: "",
        userName: "",
        city: "",
        password: "",
        repassword: "",
        userImg: "/uploads/1.jpg",
        imageHash: null,

        errorComponent: null,
        showErrorModal: false,
        resultElement: null,
    };
    const [myState, setMyState] = useState(initialState);
    const onEditBtnClick = (e) => {
        e.preventDefault();
        if (myState.password !== myState.repassword) {
            const errorsElement = (
                <ul>
                    <br />
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
                myState.city,
                myState.password,
                myState.repassword,
                imageInpRef.current.files[0]
            )
                .then((data) => {
                    let badgeClass = "";
                    let badgeMessage = "";

                    switch (data) {
                        case 1:
                            badgeClass = "alert alert-success";
                            badgeMessage =
                                "Your Profile has been changed successfully";
                            getUser(props.user.id)
                                .then((user) => {
                                    setMyState({
                                        ...myState,
                                        userImg: user.img,
                                        imageHash: Date.now(),
                                        resultElement: badge,
                                    });
                                    // setTimeout(() => {
                                    //     setMyState({
                                    //         ...myState,
                                    //         userImg: user.img,
                                    //         imageHash: Date.now(),
                                    //         resultElement: null,
                                    //     });
                                    // }, 2000);
                                })
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
        <Container>
            <PopUpModal
                show={myState.showErrorModal}
                close={closeModal}
                className="bg-danger"
                title="Entries Error"
            >
                {myState.errorComponent}
            </PopUpModal>
{/* ********************************************************* Breadcrumb ********************************************************* */}
            <Col className="p-0 mb-3">
                <Breadcrumb className="bg-transparent">
                    <BreadcrumbItem className="bg-transparent">
                        <Link to="/">Home</Link>
                    </BreadcrumbItem>
                    <BreadcrumbItem className="bg-transparent">
                        <Link to="/user">UserProfile</Link>
                    </BreadcrumbItem>
                    <BreadcrumbItem className="bg-transparent" active>DashBoard</BreadcrumbItem>
                </Breadcrumb>
            </Col>
{/* ********************************************************* End ********************************************************* */}
            <Row>
                <Col xs={6} md={9}>
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
                        key={myState.imageHash}
                        src={`${myState.userImg}?${myState.imageHash}`}
                        height={"150px"}
                        width={"150px"}
                        roundedCircle
                    />
                    <br />
                    <br />
                    <input
                        ref={imageInpRef}
                        id="exampleFormControlFile1"
                        type="file"
                        className="form-control-file"
                        accept="image/x-png,image/gif,image/jpeg"
                    />
                </Col>
            </Row>
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
                                placeholder={
                                    myState.city
                                        ? myState.city
                                        : "Enter Your city"
                                }
                                required
                                onChange={(e) => {
                                    setMyState({
                                        ...myState,
                                        city: e.target.value,
                                    });
                                }}
                                value={myState.city}
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
    );
};

const mapStateToProps = (state) => {
    return { user: state.user };
};
export default connect(mapStateToProps, {setBackgroundColor5Action, setBackgroundColor1Action})(User);
