/* ********************************************************* IMPORT ********************************************************* */
// react
import React, {useState, useEffect, useRef} from 'react';
// router dom
import {Link} from 'react-router-dom';
// redux
import {connect} from 'react-redux';
import {setBackgroundColor5Action, setBackgroundColor1Action} from '../actions';
// reactstrap
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
} from 'reactstrap';
// datepicker
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
// components
import PopUpModal from './PopUpModal';
import Select from './Select';
// services
import {editUserPost, getUserPost} from '../services/api';
// import {useWindowDimension} from '../hooks/useWindowDimension';

/* ********************************************************* COMPONENT ********************************************************* */
const UserProfile = props => {

    const imageInpRef = useRef();
    // const imgUploadRef = useRef();
    // const [width] = useWindowDimension();

    const initialState = {
        disabled: true,
        minus: false,
        userImg: '',
        firstName: '',
        lastName: '',
        street: '',
        city: '',
        zipCode: '',
        country: '',
        userName: '',
        password: '',
        repassword: '',
        newPassword: '',
        renewPassword: '',
        showModal: false,
        modalContent: null,
        badgeContent: null,
        startDate: new Date(),
        sex: [
            {
                id: 0,
                title: 'female',
                selected: false,
                key: 'sex'
            },
            {
                id: 1,
                title: 'male',
                selected: false,
                key: 'sex'
            },
            {
                id: 2,
                title: 'divers',
                selected: false,
                key: 'sex'
            }
        ]
    };
    const [state, setState] = useState(initialState);
console.log(state.disabled);
    // datepicker
    // const years = range(1990, new Date().getFullYear() + 1, 1);
    const year = new Date().getFullYear();
    const years = (i) => {
        return i <= year ? years(i + 1).concat(i) : [];
    };
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December"
    ];

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

/* ********************************************************* FUNCTIONS ********************************************************* */

    const resetThenSet = (id, key) => {
        const temp = [...state[key]];
      
        temp.forEach((item) => item.selected = false);
        temp[id].selected = true;
      
        setState({[key]: temp});
    }

/* ********************************************************* RETURN ********************************************************* */
    return (
        // <Container fluid={true} className="px-4 px-sm-5 pt-5 mt-5">
        <Container className="user-profile px-4 px-sm-5 pt-5 mt-5">
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
                        <Link to="/user/dashboard">Dashboard</Link>
                    </BreadcrumbItem>
                    <BreadcrumbItem className="bg-transparent" active>
                        Profile
                    </BreadcrumbItem>
                </Breadcrumb>
            </Col>
{/* ********************************************************* HEADLINE ********************************************************* */}
            <Col className="text-center">
                <h1 className="text-trans mb-4 mr-3 d-inline-block">Your Profile</h1>
                <Button className="edit mb-4" onClick={() => setState({...state, disabled: !state.disabled})}>
                    <img src="/public/imgs/pen_light.svg" />
                </Button>
            </Col>
            <Col className="avatar text-center">
                <img 
                    src={state.userImg ? state.userImg : '/src/imgs/dummy.svg'}
                    alt=""
                    style={{width: '150px', height: '150px', borderRadius: '50%'}}
                /> 
            </Col>
            <Col className="d-flex justify-content-center mb-3">
                <input
                    id="upload"
                    ref={imageInpRef}
                    type="file"
                    accept="image/x-png,image/gif,image/jpeg"
                    onChange={e => setState({...state, userImg: URL.createObjectURL(e.target.files[0]), minus: true})}
                    style={{left: 0, right: 0, top: 0, bottom: 0}}
                />
                {!state.minus ?
                    <Label
                        for="upload"
                        className="big badge-pill bg-transparent my-4 btn btn-secondary btn-outline-light p-0 plus"
                    >
                        <span></span><span></span>
                    </Label>
                :
                    <Button
                        className="big badge-pill bg-transparent my-4 btn btn-secondary btn-outline-light p-0 minus"
                        // ref={imgUploadRef}
                        onClick={() => setState({...state, userImg: '', minus: false})}
                    >
                        <span></span><span></span>
                    </Button>
                }
            </Col>
{/* ********************************************************* FORM ********************************************************* */}
            <Form className="pb-md-0 pb-sm-5">
                <div className="col-lg-12 col-md-12">{state.badgeContent}</div>
                <Row xs="1" md="2" className="m-auto">
                    <Col className="p-0 pr-md-5 text-center text-md-left">
                        <h4>Personal</h4>
                        <Row xs="1" md="2" className="m-auto">
                            <Col className="p-0">
                                <FormGroup>
                                    <Label className="w-100 h5 text-trans mb-2">Sex:</Label>
                                        <Select
                                            title="undefined"
                                            list={state.sex}
                                            resetThenSet={resetThenSet}
                                            className="p-0"
                                        />
                                </FormGroup>
                            </Col>
                            <Col className="p-0">
                                <FormGroup>
                                    <Label className="w-100 h5 text-trans mb-2">Birthday:</Label>
                                        <DatePicker
                                        renderCustomHeader={({
                                            date,
                                            changeYear,
                                            changeMonth,
                                            decreaseMonth,
                                            increaseMonth,
                                            prevMonthButtonDisabled,
                                            nextMonthButtonDisabled
                                        }) => (
                                            <div
                                            style={{
                                                margin: 10,
                                                display: "flex",
                                                justifyContent: "center"
                                            }}
                                            >
                                            <button onClick={decreaseMonth} disabled={prevMonthButtonDisabled}>
                                                {"<"}
                                            </button>
                                            <select
                                                value={date.getFullYear()}
                                                onChange={({ target: { value } }) => changeYear(value)}
                                            >
                                                {years(1900).map(option => (
                                                <option key={option} value={option}>
                                                    {option}
                                                </option>
                                                ))}
                                            </select>
                                    
                                            <select
                                                value={months[date.getMonth()]}
                                                onChange={({ target: { value } }) =>
                                                changeMonth(months.indexOf(value))
                                                }
                                            >
                                                {months.map(option => (
                                                <option key={option} value={option}>
                                                    {option}
                                                </option>
                                                ))}
                                            </select>
                                    
                                            <button onClick={increaseMonth} disabled={nextMonthButtonDisabled}>
                                                {">"}
                                            </button>
                                            </div>
                                        )}
                                        selected={state.startDate}
                                        onChange={date => setState({...state, startDate: date})}
                                        />
                                </FormGroup>
                            </Col>
                        </Row>
                        <FormGroup className="mb-md-4 mb-3">
                            <Label className="w-100 h5 text-trans mb-2">First Name:</Label>
                            <Row>
                                <Col style={{left: -0.3 + "rem"}}>
                                    <Input
                                        className={"badge-pill text-trans bg-transparent text-center text-md-left" + (state.disabled ? " profile" : "")}
                                        type="text"
                                        placeholder={state.firstName}
                                        required
                                        onChange={e => setState({...state, firstName: e.target.value})}
                                        value={state.firstName}
                                        disabled={state.disabled}
                                    />
                                </Col>
                            </Row>
                        </FormGroup>
                        <FormGroup className="mb-md-4 mb-3">
                            <Label className="w-100 h5 text-trans mb-2">Last Name:</Label>
                            <Row>
                                <Col style={{left: -0.3 + "rem"}}>
                                    <Input
                                        className={"badge-pill text-trans bg-transparent text-center text-md-left" + (state.disabled ? " profile" : "")}
                                        type="text"
                                        placeholder={state.lastName}
                                        required
                                        onChange={e => setState({...state, lastName: e.target.value})}
                                        value={state.lastName}
                                        disabled={state.disabled}
                                    />
                                </Col>
                            </Row>
                        </FormGroup>
                        <FormGroup className="mb-4">
                            <Label className="w-100 h5 text-trans mb-2">Email:</Label>
                            <Row>
                                <Col style={{left: -0.3 + "rem"}}>
                                    <Input
                                        className={"badge-pill text-trans bg-transparent text-center text-md-left" + (state.disabled ? " profile" : "")}
                                        type="text"
                                        placeholder={state.email}
                                        required
                                        onChange={e => setState({...state, email: e.target.value})}
                                        value={state.email}
                                        disabled={state.disabled}
                                    />
                                </Col>
                            </Row>
                        </FormGroup>
                    </Col>
                    <Col className="p-0 pl-md-5 text-center text-md-left">
                        <h4>Address</h4>
                        <FormGroup className="mb-md-4 mb-3">
                            <Label className="w-100 h5 text-trans mb-2">Street:</Label>
                            <Row>
                                <Col style={{left: -0.3 + "rem"}}>
                                    <Input
                                        className={"badge-pill text-trans bg-transparent text-center text-md-left" + (state.disabled ? " profile" : "")}
                                        type="text"
                                        placeholder={state.city}
                                        onChange={e => setState({...state, street: e.target.value})}
                                        value={state.city}
                                        disabled={state.disabled}
                                    />
                                </Col>
                            </Row>
                        </FormGroup>
                        <FormGroup className="mb-md-4 mb-3">
                            <Label className="w-100 h5 text-trans mb-2">City:</Label>
                            <Row>
                                <Col style={{left: -0.3 + "rem"}}>
                                    <Input
                                        className={"badge-pill text-trans bg-transparent text-center text-md-left" + (state.disabled ? " profile" : "")}
                                        type="text"
                                        placeholder={state.city}
                                        onChange={e => setState({...state, city: e.target.value})}
                                        value={state.city}
                                        disabled={state.disabled}
                                    />
                                </Col>
                            </Row>
                        </FormGroup>
                        <FormGroup className="mb-4">
                            <Label className="w-100 h5 text-trans mb-2">Zip Code:</Label>
                            <Row>
                                <Col style={{left: -0.3 + "rem"}}>
                                    <Input
                                        className={"badge-pill text-trans bg-transparent text-center text-md-left" + (state.disabled ? " profile" : "")}
                                        type="text"
                                        placeholder={state.zipCode}
                                        onChange={e => setState({...state, zipCode: e.target.value})}
                                        value={state.zipCode}
                                        disabled={state.disabled}
                                    />
                                </Col>
                            </Row>
                        </FormGroup>
                        <FormGroup className="mb-md-4 mb-3">
                            <Label className="w-100 h5 text-trans mb-2">Country:</Label>
                            <Row>
                                <Col style={{left: -0.3 + "rem"}}>
                                    <Input
                                        className={"badge-pill text-trans bg-transparent text-center text-md-left" + (state.disabled ? " profile" : "")}
                                        type="text"
                                        placeholder={state.country}
                                        onChange={e => setState({...state, country: e.target.value})}
                                        value={state.country}
                                        disabled={state.disabled}
                                    />
                                </Col>
                            </Row>
                        </FormGroup>
                    </Col>
                    {/* <Col xs="12" sm={{size: 8, offset: 2}} lg={{size: 6, offset: 3}} xl={{size: 4, offset: 4}} className="p-0"> */}
                </Row>
                <Row xs="1" md="2" className="m-auto">
                    <Col className="p-0 pr-md-5 text-center text-md-left">
                        <h4>Password</h4>
                        <FormGroup className="mb-md-4 mb-3">
                            <Label className="w-100 h5 text-trans mb-2">Current Password:</Label>
                            <Row>
                                <Col style={{left: -0.3 + "rem"}}>
                                    <Input
                                        className={"badge-pill text-trans bg-transparent text-center text-md-left" + (state.disabled ? " profile" : "")}
                                        type="text"
                                        placeholder={state.password}
                                        required
                                        onChange={e => setState({...state, password: e.target.value})}
                                        value={state.password}
                                        disabled={state.disabled}
                                    />
                                </Col>
                            </Row>
                        </FormGroup>
                        <FormGroup className={"mb-md-4 mb-3" + (state.disabled ? " hidden" : "")}>
                            <Label className="w-100 h5 text-trans mb-2">Repeat Current Password:</Label>
                            <Row>
                                <Col style={{left: -0.3 + "rem"}}>
                                    <Input
                                        className={"badge-pill text-trans bg-transparent text-center text-md-left" + (state.disabled ? " profile" : "")}
                                        type="text"
                                        required
                                        onChange={e => setState({...state, repassword: e.target.value})}
                                        value={state.password}
                                    />
                                </Col>
                            </Row>
                        </FormGroup>
                    </Col>
                    <Col className="p-0 pl-md-5 text-center text-md-left">
                        <FormGroup className={"mb-md-4 mb-3" + (state.disabled ? " hidden" : "")}>
                            <Label className="w-100 h5 text-trans mb-2">New Password:</Label>
                            <Row>
                                <Col style={{left: -0.3 + "rem"}}>
                                    <Input
                                        className={"badge-pill text-trans bg-transparent text-center text-md-left" + (state.disabled ? " profile" : "")}
                                        type="text"
                                        placeholder={state.password}
                                        required
                                        onChange={e => setState({...state, newPassword: e.target.value})}
                                        value={state.password}
                                    />
                                </Col>
                            </Row>
                        </FormGroup>
                        <FormGroup className={"mb-4" + (state.disabled ? " hidden" : "")}>
                            <Label className="w-100 h5 text-trans mb-2">Repeat New Password:</Label>
                            <Row>
                                <Col style={{left: -0.3 + "rem"}}>
                                    <Input
                                        className={"badge-pill text-trans bg-transparent text-center text-md-left" + (state.disabled ? " profile" : "")}
                                        type="text"
                                        placeholder={state.password}
                                        required
                                        onChange={e => setState({...state, renewPassword: e.target.value})}
                                        value={state.password}
                                    />
                                </Col>
                            </Row>
                        </FormGroup>
                    </Col>
                </Row>
                <Col xs="12" className={"text-center text-trans" + (state.disabled ? " hidden" : "")}>
                    <Button className="big badge-pill bg-transparent my-4 btn btn-secondary btn-outline-light p-0 plus">
                        <span></span><span></span>
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
