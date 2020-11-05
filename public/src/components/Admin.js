// export default Register;
import React, { Fragment, useState, useEffect } from "react";
import {
    Container,
    Row,
    Col,
    Button,
    Table,
    ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem,
} from "reactstrap";
import Image from "react-bootstrap/Image";
import {
    Link,
    // useLocation,
    // useHistory
} from "react-router-dom";
import PopUpModal from "./PopUpModal";
// import validator from "validator";
import { getAllUsers, changeVerificationPost } from "../services/api";

import { connect } from "react-redux";

const Admin = (props) => {

    const initialState = {
        users: [],
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

    useEffect(() => {
        getAllUsers()
            .then((data) => {
                setMyState({
                    ...myState,
                    users: data, 
                });
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

/* ********************************************************* Change User Verification ********************************************************* */

    const onVerifiedBtnClick = (e, userID, email, verified) => {
        e.preventDefault();
        console.log(userID);
        changeVerificationPost(userID, email, verified)
        .then(data=>{
            let newUsers = myState.users.map(user=>{
                if (user.id == userID) {
                    user.verified = !user.verified
                }
                return user
            })

            setMyState({
                ...myState,
                users: newUsers, 
            });
            
        })
        .catch(err=>{
            console.log(err);
        })
    };

/* ********************************************************* DELETE User ********************************************************* */

    // const showUsers = ()=>{
    //     return(

    //     )
    // }

    // const location = useLocation()
    // const history = useHistory()
    // const user = { ...props.user };
    // console.log(props.user);
    // console.log('location.state '+location.state);
    // if(!location.state){
    //     history.push('/login')
    // }

    const onDeleteBtnClick = (e) => {
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
        } 
    }

    const closeModal = () => {
        setMyState({
            ...myState,
            showErrorModal: false,
        });
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
                        <h1 className="text-trans mb-4">
                            {/* Hello Admin: {props.user.firstName + " " + props.user.lastName} */}
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
                </Row>
                <br />
                <br />
                <br />
                <Row>
                    <Table hover dark responsive>
                        <thead>
                            <tr>
                                <th>First Name</th>
                                <th>Last Name</th>
                                <th>User Name</th>
                                <th>Email</th>
                                <th>Verified</th>
                                <th>Role</th>
                                <th>Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            {myState.users.map((user, idx) => {
                                return (
                                    <tr key={user.id}>
                                        <td>{user.firstname}</td>
                                        <td>{user.lastname}</td>
                                        <td>{user.username}</td>
                                        <td>{user.email}</td>
                                        <td>
                                            <Button 
                                            onClick={e => onVerifiedBtnClick(e, user.id, user.email, user.verified)}
                                            >
                                                {user.verified ? "Yes" : "No"}
                                            </Button>
                                        </td>
                                        <td>
                                            {user.role}
                                        </td>
                                        <td>
                                            <Button
                                                onClick={onDeleteBtnClick}
                                                outline
                                                color="danger"
                                            >
                                                Delete
                                            </Button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </Table>
                </Row>
                <br />
                <br />
                <br />
            </Container>
        </Fragment>
    );
};

const mapStateToProps = (state) => {
    return { user: state.user };
};

export default connect(mapStateToProps)(Admin);
