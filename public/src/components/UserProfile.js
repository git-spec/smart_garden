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
// components
import PopUpModal from './PopUpModal';
// services
import {editUserPost, getUserPost} from '../services/api';
// import {useWindowDimension} from '../hooks/useWindowDimension';

/* ********************************************************* COMPONENT ********************************************************* */
const UserProfile = props => {

    const imageInpRef = useRef();
    // const [width] = useWindowDimension();

    const initialState = {
        userImg: '',
        firstName: '',
        lastName: '',
        city: '',
        userName: '',
        password: '',
        repassword: '',
        showModal: false,
        modalContent: null,
        badgeContent: null
    };
    const [state, setState] = useState(initialState);

/* ********************************************************* USE EFFECT ********************************************************* */
    useEffect(() => {
        // saves background color in redux
        props.setBackgroundColor1Action('color-1');
        props.setBackgroundColor5Action(null);

        // gets user data from database
        let mounted = true;
        getUserPost(props.user.id).then(user => {
            switch (user) {
                case 2:
                    alert('Server error!');
                    break;
                case 3:
                    alert('No user found!');
                    break;
                default:
                    if (mounted) {
                        setState({
                            ...state,
                            firstName: user.firstname,
                            lastName: user.lastname,
                            userName: user.username,
                            city: user.city,
                            userImg: user.img
                        });      
                    }
                    break;
            }
        }).catch(err => {
            console.log(err);
        });    

        // cleanup
        return () => {
            mounted = false;
        };
    // eslint-disable-next-line
    }, []);

/* ********************************************************* EDIT BUTTON ********************************************************* */
    // The user can change his or her data in the user profile:
    // The name, the user name and the personal password can be changed and the place of residence can be added.
    const onEditBtnClick = e => {
        e.preventDefault();
        if (state.password !== state.repassword) {
            setState({
                ...state,
                modalContent: <p>Passwords do not match</p>,
                showModal: true
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
                    case 2:
                        badgeClass = 'alert alert-danger';
                        badgeMessage = 'There was a server side error, please contact the administrator.';
                        break;
                    case 3:
                        badgeClass = 'alert alert-danger';
                        badgeMessage = 'There is already a user with the same username, please choose another one.';
                        break;
                    default:
                        badgeClass = 'alert alert-success';
                        badgeMessage = 'Your profile has been changed successfully.';
                        break;
                }
                const badgeContentElement = (
                    <div className={badgeClass} role="alert">
                        {badgeMessage}
                    </div>
                );
                setState({...state, badgeContent: badgeContentElement});        
            }).catch(() => {
                const badgeContentElement = (
                    <div className="alert alert-danger" role="alert">
                        Can not send the data to server.
                    </div>
                );
                setState({...state, badgeContent: badgeContentElement});
            });
        }
    };

/* ********************************************************* RETURN ********************************************************* */
    return (
        <Container fluid={true} className="px-4 px-sm-5 pt-5 mt-5">
{/* ********************************************************* MODAL ********************************************************* */}
            <PopUpModal 
                className="bg-danger" 
                title="Entries Error"            
                show={state.showModal} 
                close={() => setState({...state, showModal: false})} 
            >
                {state.modalContent}
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
                <Col className="text-center">
                    <h3 className="text-trans mb-4">Your Profile</h3>
                </Col>
                <Col className="avatar text-center">
                    <img 
                        src={state.userImg ? state.userImg : '/src/imgs/dummy.svg'}
                        alt=""
                        style={{width: '150px', height: '150px', borderRadius: '50%'}}
                    /> 
                </Col>
                <Col className="d-flex justify-content-center mb-3">
                    <Label for="upload" className="badge-pill btn-outline-light bg-transparent my-4 btn btn-secondary">Upload</Label>
                    <input
                        id="upload"
                        ref={imageInpRef}
                        type="file"
                        accept="image/x-png,image/gif,image/jpeg"
                        onChange={e => setState({...state, userImg: URL.createObjectURL(e.target.files[0])})}
                        style={{visibility: "hidden", width: 0}}
                    />
                </Col>
{/* ********************************************************* FORM ********************************************************* */}
            <Form className="pb-md-0 pb-5">
                <div className="col-lg-12 col-md-12">{state.badgeContent}</div>
                <Row>
                    <Col xs="12" sm={{size: 8, offset: 2}} lg={{size: 6, offset: 3}} xl={{size: 4, offset: 4}} className="p-0">
                        <FormGroup className="mb-md-4 mb-3 text-left">
                            <Label className="w-100 h5 text-trans mb-2 ml-2">First Name:</Label>
                            <Row>
                                <Col xs="10">
                                    <Input
                                        className="badge-pill text-trans bg-transparent"
                                        type="text"
                                        placeholder={state.firstName}
                                        required
                                        onChange={e => setState({...state, firstName: e.target.value})}
                                        value={state.firstName}
                                    />
                                </Col>
                                <Col className="d-flex justify-content-end">
                                    <Button className="badge-pill btn-outline-light bg-transparent" onClick={onEditBtnClick}>
                                        Edit
                                    </Button>
                                </Col>
                            </Row>
                        </FormGroup>
                    </Col>
                    <Col xs="12" sm={{size: 8, offset: 2}} lg={{size: 6, offset: 3}} xl={{size: 4, offset: 4}} className="p-0">
                        <FormGroup className="mb-4 text-left">
                            <Label className="w-100 h5 text-trans mb-2 ml-2">Last Name:</Label>
                            <Row>
                                <Col xs="10">
                                    <Input
                                        className="badge-pill bg-transparent"
                                        type="text"
                                        placeholder={state.lastName}
                                        required
                                        onChange={e => setState({...state, lastName: e.target.value})}
                                        value={state.lastName}
                                    />
                                </Col>
                                <Col className="d-flex justify-content-end">
                                    <Button className="badge-pill btn-outline-light bg-transparent" onClick={onEditBtnClick}>
                                        Edit
                                    </Button>
                                </Col>
                            </Row>
                        </FormGroup>
                    </Col>
                    <Col xs="12" sm={{size: 8, offset: 2}} lg={{size: 6, offset: 3}} xl={{size: 4, offset: 4}} className="p-0">
                        <FormGroup className="mb-4 text-left">
                            <Label className="w-100 h5 text-trans mb-2 ml-2">User Name:</Label>
                            <Row>
                                <Col xs="10">
                                    <Input
                                        className="badge-pill bg-transparent"
                                        type="text"
                                        placeholder={state.userName}
                                        required
                                        onChange={e => setState({...state, userName: e.target.value})}
                                        value={state.userName}
                                    />
                                </Col>
                                <Col className="d-flex justify-content-end">
                                    <Button className="badge-pill btn-outline-light bg-transparent" onClick={onEditBtnClick}>
                                        Edit
                                    </Button>
                                </Col>
                            </Row>
                        </FormGroup>
                    </Col>
                    <Col xs="12" sm={{size: 8, offset: 2}} lg={{size: 6, offset: 3}} xl={{size: 4, offset: 4}} className="p-0">
                        <FormGroup className="mb-4 text-left">
                            <Label className="w-100 h5 text-trans mb-2 ml-2">Email:</Label>
                            <Row>
                                <Col xs="10">
                                    <Input
                                        className="badge-pill bg-transparent"
                                        type="text"
                                        placeholder={state.email}
                                        required
                                        onChange={e => setState({...state, email: e.target.value})}
                                        value={state.email}
                                    />
                                </Col>
                                <Col className="d-flex justify-content-end">
                                    <Button className="badge-pill btn-outline-light bg-transparent" onClick={onEditBtnClick}>
                                        Edit
                                    </Button>
                                </Col>
                            </Row>
                        </FormGroup>
                    </Col>
                    <Col xs="12" sm={{size: 8, offset: 2}} lg={{size: 6, offset: 3}} xl={{size: 4, offset: 4}} className="p-0">
                        <FormGroup className="mb-4 text-left">
                            <Label className="w-100 h5 text-trans mb-2 ml-2">Password:</Label>
                            <Row>
                                <Col xs="10">
                                    <Input
                                        className="badge-pill bg-transparent"
                                        type="text"
                                        placeholder={state.password}
                                        required
                                        onChange={e => setState({...state, password: e.target.value})}
                                        value={state.password}
                                    />
                                </Col>
                                <Col className="d-flex justify-content-end">
                                    <Button className="badge-pill btn-outline-light bg-transparent" onClick={onEditBtnClick}>
                                        Edit
                                    </Button>
                                </Col>
                            </Row>
                        </FormGroup>
                    </Col>
                    <Col xs="12" sm={{size: 8, offset: 2}} lg={{size: 6, offset: 3}} xl={{size: 4, offset: 4}} className="p-0">
                        <FormGroup className="mb-4 text-left">
                            <Label className="w-100 h5 text-trans mb-2 ml-2">Birthday:</Label>
                            <Row>
                                <Col xs="10">
                                    <Input
                                        className="badge-pill bg-transparent"
                                        type="text"
                                        placeholder={state.Birthday}
                                        required
                                        onChange={e => setState({...state, birthday: e.target.value})}
                                        value={state.birthday}
                                    />
                                </Col>
                                <Col className="d-flex justify-content-end">
                                    <Button className="badge-pill btn-outline-light bg-transparent" onClick={onEditBtnClick}>
                                        Edit
                                    </Button>
                                </Col>
                            </Row>
                        </FormGroup>
                    </Col>
                    <Col xs="12" sm={{size: 8, offset: 2}} lg={{size: 6, offset: 3}} xl={{size: 4, offset: 4}} className="p-0">
                        <FormGroup className="mb-4 text-left">
                            <Label className="w-100 h5 text-trans mb-2 ml-2">City:</Label>
                            <Row>
                                <Col xs="10">
                                    <Input
                                        className="badge-pill bg-transparent"
                                        type="text"
                                        placeholder={state.city}
                                        required
                                        onChange={e => setState({...state, city: e.target.value})}
                                        value={state.city}
                                    />
                                </Col>
                                <Col className="d-flex justify-content-end">
                                    <Button className="badge-pill btn-outline-light bg-transparent" onClick={onEditBtnClick}>
                                        Edit
                                    </Button>
                                </Col>
                            </Row>
                        </FormGroup>
                    </Col>
                    <Col xs="12" sm={{size: 8, offset: 2}} lg={{size: 6, offset: 3}} xl={{size: 4, offset: 4}} className="p-0">
                        <FormGroup className="mb-4 text-left">
                            <Label className="w-100 h5 text-trans mb-2 ml-2">Zip Code:</Label>
                            <Row>
                                <Col xs="10">
                                    <Input
                                        className="badge-pill bg-transparent"
                                        type="text"
                                        placeholder={state.zipCode}
                                        required
                                        onChange={e => setState({...state, zipCode: e.target.value})}
                                        value={state.zipCode}
                                    />
                                </Col>
                                <Col className="d-flex justify-content-end">
                                    <Button className="badge-pill btn-outline-light bg-transparent" onClick={onEditBtnClick}>
                                        Edit
                                    </Button>
                                </Col>
                            </Row>
                        </FormGroup>
                    </Col>
                    <Col xs="12" sm={{size: 8, offset: 2}} lg={{size: 6, offset: 3}} xl={{size: 4, offset: 4}} className="p-0">
                        <FormGroup className="mb-4 text-left">
                            <Label className="w-100 h5 text-trans mb-2 ml-2">Country:</Label>
                            <Row>
                                <Col xs="10">
                                    <Input
                                        className="badge-pill bg-transparent"
                                        type="text"
                                        placeholder={state.country}
                                        required
                                        onChange={e => setState({...state, country: e.target.value})}
                                        value={state.country}
                                    />
                                </Col>
                                <Col className="d-flex justify-content-end">
                                    <Button className="badge-pill btn-outline-light bg-transparent" onClick={onEditBtnClick}>
                                        Edit
                                    </Button>
                                </Col>
                            </Row>
                        </FormGroup>
                    </Col>
                    <Col xs="12" sm={{size: 8, offset: 2}} lg={{size: 6, offset: 3}} xl={{size: 4, offset: 4}}>
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
                    <Col xs="12" sm={{size: 8, offset: 2}} lg={{size: 6, offset: 3}} xl={{size: 4, offset: 4}}>
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

/* ********************************************************* MAP STATE TO PROPS ********************************************************* */
const mapStateToProps = state => {
    return {user: state.user};
};

/* ********************************************************* EXPORT ********************************************************* */
export default connect(mapStateToProps, {setBackgroundColor5Action, setBackgroundColor1Action})(UserProfile);
