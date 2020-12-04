/* ********************************************************* IMPORT ********************************************************* */
// react
import React, {useState, useEffect, useRef} from 'react';
// router dom
import {Link} from 'react-router-dom';
// redux
import {connect} from 'react-redux';
import {setBackgroundColor5Action, setBackgroundColor1Action} from '../actions';
// reactstrap
import {Container, Row, Col, Button, Input, Form, Label, FormGroup, Breadcrumb, BreadcrumbItem} from 'reactstrap';
// react bootstrap
import Image from 'react-bootstrap/Image';
// components
import PopUpModal from './PopUpModal';
// services
import {editUserPost, getUserPost} from '../services/api';

/* ********************************************************* COMPONENT ********************************************************* */
const UserProfile = props => {

    const imageInpRef = useRef();

    const initialState = {
        firstName: '',
        lastName: '',
        userName: '',
        city: '',
        password: '',
        repassword: '',
        userImg: '/uploads/1.jpg',
        imageHash: null,
        errorComponent: null,
        showErrorModal: false,
        resultElement: null
    };
    const [state, setState] = useState(initialState);

/* ********************************************************* USE EFFECT ********************************************************* */
    useEffect(() => {
        // save background color in redux
        props.setBackgroundColor1Action('color-1');
        props.setBackgroundColor5Action(null);
        // get user data from db
        getUserPost(props.user.id).then(user => {
            switch (user) {
                case 2:
                    alert('Server error!');
                    break;
                case 3:
                    alert('No user found!');
                    break;
                default:
                    if (user.img) {
                        setState({
                            ...state,
                            firstName: user.firstname,
                            lastName: user.lastname,
                            userName: user.username,
                            city: user.city,
                            userImg: user.img
                        });
                    } else {
                        setState({
                            ...state,
                            firstName: user.firstname,
                            lastName: user.lastname,
                            userName: user.username,
                            city: user.city
                        });
                    }        
                    break;
            }
        }).catch(err => {
            console.log(err);
        });
    // eslint-disable-next-line
    }, []);

/* ********************************************************* EDIT BUTTON ********************************************************* */
    const onEditBtnClick = e => {
        e.preventDefault();
        if (state.password !== state.repassword) {
            const errorsElement = (
                <ul>
                    <br />
                    {state.password !== state.repassword ? <li>Passwords do not match</li> : null}
                </ul>
            );
            setState({
                ...state,
                errorComponent: errorsElement,
                showErrorModal: true
            });
        } else {
            editUserPost(
                props.user.id,
                state.firstName,
                state.lastName,
                state.userName,
                state.city,
                state.password,
                state.repassword,
                imageInpRef.current.files[0]
            ).then(data => {
                let badgeClass = '';
                let badgeMessage = '';
                switch (data) {
                    case 1:
                        badgeClass = 'alert alert-success';
                        badgeMessage = 'Your profile has been changed successfully.';
                        getUserPost(props.user.id).then(user => {
                            setState({
                                ...state,
                                userImg: user.img,
                                imageHash: Date.now(),
                                resultElement: badge
                            });
                        });
                        break;
                    case 2:
                        badgeClass = 'alert alert-danger';
                        badgeMessage = 'There was a server side error, please contact the administrator.';
                        break;
                    case 3:
                        badgeClass = 'alert alert-danger';
                        badgeMessage =
                            'There is already a user with the same username, please choose another one.';
                        break;
                    default:
                        break;
                }
                const badge = (
                    <div className={badgeClass} role="alert">
                        {badgeMessage}
                    </div>
                );
                setState({
                    ...state,
                    resultElement: badge
                });
            }).catch(() => {
                const badge = (
                    <div className="alert alert-danger" role="alert">
                        Can not send the data to server.
                    </div>
                );
                setState({
                    ...state,
                    resultElement: badge
                });
            });
        }
    };

/* ********************************************************* CLOSE MODAL ********************************************************* */
    const closeModal = () => {
        setState({
            ...state,
            showErrorModal: false
        });
    };

/* ********************************************************* RETURN ********************************************************* */
    return (
        <Container className="pt-4 mt-5">
{/* ********************************************************* MODAL ********************************************************* */}
            <PopUpModal show={state.showErrorModal} close={closeModal} className="bg-danger" title="Entries Error">
                {state.errorComponent}
            </PopUpModal>
{/* ********************************************************* BREADCRUMB ********************************************************* */}
            <Col className="p-0 mb-3">
                <Breadcrumb className="bg-transparent">
                    <BreadcrumbItem className="bg-transparent">
                        <Link to="/">Home</Link>
                    </BreadcrumbItem>
                    <BreadcrumbItem className="bg-transparent">
                        <Link to="/user/dashboard">DashBoard</Link>
                    </BreadcrumbItem>
                    <BreadcrumbItem className="bg-transparent" active>
                        UserProfile
                    </BreadcrumbItem>
                </Breadcrumb>
            </Col>
{/* ********************************************************* HEADLINE ********************************************************* */}
            <Row>
                <Col xs={6} md={9}>
                    <h1 className="text-trans mb-4">Hello {props.user.firstName} {props.user.lastName},</h1>
                    <h3 className="text-trans mb-4">welcome to your profile page.</h3>
                    <br />
                    <p className="text-trans mb-4">Here you can edit your personal settings:</p>
                </Col>
                <Col className="float-right" xs={6} md={3}>
                    <Image
                        key={state.imageHash}
                        src={`${state.userImg}?${state.imageHash}`}
                        height={'150px'}
                        width={'150px'}
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
                <div className="col-lg-12 col-md-12">{state.resultElement}</div>
                <Row xs="1" sm="2">
                    <Col>
                        <FormGroup className="mb-md-4 mb-3 text-left">
                            <Label className="w-100 h5 text-trans mb-2 ml-2">First Name:</Label>
                            <Input
                                className="badge-pill text-trans bg-transparent"
                                type="text"
                                placeholder={state.firstName}
                                required
                                onChange={e => setState({...state, firstName: e.target.value})}
                                value={state.firstName}
                            />
                        </FormGroup>
                    </Col>
                    <Col>
                        <FormGroup className="mb-4 text-left">
                            <Label className="w-100 h5 text-trans mb-2 ml-2">Last Name:</Label>
                            <Input
                                className="badge-pill bg-transparent"
                                type="text"
                                placeholder={state.lastName}
                                required
                                onChange={e => setState({...state, lastName: e.target.value})}
                                value={state.lastName}
                            />
                        </FormGroup>
                    </Col>
                    <Col>
                        <FormGroup className="mb-4 text-left">
                            <Label className="w-100 h5 text-trans mb-2 ml-2">City:</Label>
                            <Input
                                className="badge-pill bg-transparent"
                                type="text"
                                placeholder={state.city ? state.city : 'Enter your location'}
                                required
                                onChange={e => setState({...state, city: e.target.value})}
                                value={state.city}
                            />
                        </FormGroup>
                    </Col>
                    <Col>
                        <FormGroup className="mb-4 text-left">
                            <Label className="w-100 h5 text-trans mb-2 ml-2">User Name:</Label>
                            <Input
                                className="badge-pill bg-transparent"
                                type="text"
                                placeholder={state.userName}
                                required
                                onChange={e => setState({...state, userName: e.target.value})}
                                value={state.userName}
                            />
                        </FormGroup>
                    </Col>
                    <Col>
                        <FormGroup className="mb-4 text-left">
                            <Label className="w-100 h5 text-trans mb-2 ml-2">New Password:</Label>
                            <Input
                                className="badge-pill bg-transparent"
                                type="password"
                                placeholder="Choose a new password"
                                required
                                onChange={e => setState({...state, password: e.target.value})}
                                value={state.password}
                            />
                        </FormGroup>
                    </Col>
                    <Col>
                        <FormGroup className="mb-3 text-left">
                            <Label className="w-100 h5 text-trans mb-2 ml-2">Repeat New Password:</Label>
                            <Input
                                className="badge-pill bg-transparent"
                                type="password"
                                placeholder="Repeat your new password"
                                required
                                onChange={e => setState({...state, repassword: e.target.value})}
                                value={state.repassword}
                            />
                        </FormGroup>
                    </Col>
                </Row>
                <Col className=" text-center">
                    <Button className="badge-pill btn-outline-light bg-transparent my-4" onClick={onEditBtnClick}>
                        Edit
                    </Button>
                </Col>
            </Form>
        </Container>
    );
};

const mapStateToProps = state => {
    return {user: state.user};
};
export default connect(mapStateToProps, {setBackgroundColor5Action, setBackgroundColor1Action})(UserProfile);
