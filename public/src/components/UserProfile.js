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
// hooks
import {validateChar} from '../hooks/useValidation';
// import {useWindowDimension} from '../hooks/useWindowDimension';
// images
import {ReactComponent as EditOutlined} from '../imgs/pen_outlined.svg';
import {ReactComponent as EditFilled} from '../imgs/pen_filled.svg';

/* ********************************************************* COMPONENT ********************************************************* */
const UserProfile = props => {

    const imageInpRef = useRef();
    const outlinedEditRef = useRef();
    const filledEditRef = useRef();
    const minusPassRef = useRef();
    const closePassRef = useRef();
    const plusEmailRef = useRef();
    const closeEmailRef = useRef();
    // const minusUsrRef = useRef();
    // const closeUsrRef = useRef();
    // const imgUploadRef = useRef();
    // const [width] = useWindowDimension();

    const initialState = {
        disabled: true,
        disabledPass: true,
        disabledEmail: true,
        // disabledUsr: true,
        minus: false,
        closeEdit: false,
        closePass: false,
        userImg: '',
        sex: '– – –',
        title: '– – –',
        firstName: '',
        lastName: '',
        street: '– – –',
        city: '– – –',
        zip: '– – –',
        country: '– – –',
        userName: '',
        password: '',
        repassword: '',
        newPassword: '',
        renewPassword: '',
        showModal: false,
        modalContent: null,
        badgeContent: null,
        startDate: new Date(),
        sexList: [
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
        ],
        titleList: [
            {
                id: 0,
                title: 'Prof.',
                selected: false,
                key: 'title'
            },
            {
                id: 1,
                title: 'Dr.',
                selected: false,
                key: 'title'
            }
        ]
    };
    const [state, setState] = useState(initialState);
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
let firstName = 'wr4x31*#';
console.log(validateChar(firstName));

/* ********************************************************* USE EFFECT ********************************************************* */
    useEffect(() => {
        // saves background color in redux
        props.setBackgroundColor1Action('color-1');
        props.setBackgroundColor5Action(null);
        // show outlined icon of edit
        outlinedEditRef.current.style.display = 'block';
        filledEditRef.current.style.display = 'none';
        // show minus icon of password-edit
        minusPassRef.current.style.display = 'none';
        closePassRef.current.style.display = 'none';
        // show plus icon of email-edit
        plusEmailRef.current.style.display = 'none';
        closeEmailRef.current.style.display = 'none';
        // show minus icon of username-edit
        // minusUsrRef.current.style.display = 'none';
        // closeUsrRef.current.style.display = 'none';
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
                            sex: user.sex,
                            tilte: user.title,
                            firstName: user.firstname,
                            lastName: user.lastname,
                            userName: user.username,
                            email: user.email,
                            street: user.street,
                            city: user.city,
                            zip: user.zip,
                            country: user.country,
                            password: user.password,
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
    // edit-icon
    useEffect(() => {
        // toggle edit-icon
        if (filledEditRef.current.style.display === 'block') {
            setTimeout(() => {
                outlinedEditRef.current.style.display = 'block';
                filledEditRef.current.style.display = 'none';
            }, 100);
        };
    });

/* ********************************************************* EDIT BUTTON ********************************************************* */
    // The user can change his or her data in the user profile:
    // The name, the user name and the personal password can be changed and the place of residence can be added.
    const onEditBtnClick = e => {
        e.preventDefault();
        const passwordHash = require('password-hash');
        if (state.repassword) {
            if (!passwordHash.verify(state.repassword, state.password)) {
                setState({
                    ...state,
                    modalContent: <p>Old Passwords do not match</p>,
                    showModal: true
                });
            }  else {
                if (state.newPassword !== state.renewPassword) {
                    setState({
                        ...state,
                        modalContent: <p>New Passwords do not match</p>,
                        showModal: true
                    });
                } else {
                    editUserPost(
                        props.user.id,
                        imageInpRef.current.files[0],
                        state.sex,
                        state.title,
                        state.firstName,
                        state.lastName,
                        state.userName,
                        state.street,
                        state.city,
                        state.zip,
                        state.country,
                        state.newPassword
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
                                setState({...state, disabled: true, close:false});
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
            }
        } else {
            editUserPost(
                props.user.id,
                imageInpRef.current.files[0],
                state.sex,
                state.title,
                state.firstName,
                state.lastName,
                state.userName,
                state.street,
                state.city,
                state.zip,
                state.country
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
                        setState({...state, disabled: true, close:false});
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
      
        temp.forEach(item => item.selected = false);
        temp[id].selected = true;
      
        setState({...state, [key]: temp});
    }
    // toggle edit button
    const toggleEditDown = e => {
        e.preventDefault();
        if (!state.closeEdit) {
            outlinedEditRef.current.style.display = 'none';
            filledEditRef.current.style.display = 'block';
        } else {
            outlinedEditRef.current.style.display = 'none';
            filledEditRef.current.style.display = 'none';
        };
    }
    // toggle close button of edit
    const toggleEditUp = e => {
        if (!state.closeEdit) {
            filledEditRef.current.parentNode.style.display = 'none';
            filledEditRef.current.parentNode.nextElementSibling.style.display = 'inline-block';
            minusPassRef.current.style.display = 'inline-block';
            plusEmailRef.current.style.display = 'inline-block';
            // minusUsrRef.current.style.display = 'inline-block';
        } else {
            filledEditRef.current.parentNode.nextElementSibling.style.display = 'none';
            filledEditRef.current.parentNode.style.display = 'inline-block';
            minusPassRef.current.style.display = 'none';
            plusEmailRef.current.style.display = 'none';
            // minusUsrRef.current.style.display = 'none';
        };
    }

/* ********************************************************* RETURN ********************************************************* */
    return (
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
                <Button className="edit mb-4 btn-outline-light"
                        onClick={e => setState({...state, disabled: !state.disabled, closeEdit: true})}
                        onMouseDown={e => toggleEditDown(e)}
                        onMouseUp={e => toggleEditUp(e)}
                >
                    <EditOutlined width="2.5rem" height="2.5rem" stroke="#FDD79D" ref={outlinedEditRef} />
                    <EditFilled width="2.5rem" height="2.5rem" fill="#FDD79D" ref={filledEditRef} />
                </Button>
                <Button
                    type="button"
                    className="btn-close badge-pill bg-transparent mb-4 btn btn-secondary btn-outline-light p-0"
                    aria-label="Close"
                    onClick={() => setState({...state, disabled: !state.disabled, disabledPass: !state.disabledPass, closeEdit: false, closePass: false})}
                    onMouseUp={() => {
                        closePassRef.current.style.display = 'none';
                        minusPassRef.current.style.display = 'inline-block';
                        toggleEditUp()
                    }}
                >
                    <span></span><span></span>
                </Button>
            </Col>
            <Col className="avatar text-center">
                <img 
                    src={state.userImg ? state.userImg : '/src/imgs/dummy.svg'}
                    alt="avatar"
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
                        className="big-1 badge-pill bg-transparent my-4 btn btn-secondary btn-outline-light p-0 plus"
                        style={state.disabled ? {visibility: 'hidden', disabled: true} : {visibility: 'visible', disabled: false}}
                    >
                        <span></span><span></span>
                    </Label>
                :
                    <Button
                        className="big-1 badge-pill bg-transparent my-4 btn btn-secondary btn-outline-light p-0 minus"
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
                            <Col className="p-0 mb-sm-2">
                                <FormGroup>
                                    <Label name="sex" className="w-100 h5 text-trans mb-2">Sex:</Label>
                                        <Select
                                            title={state.sex}
                                            list={state.sexList}
                                            resetThenSet={resetThenSet}
                                            className={state.disabled ? " profile" : ""}
                                            disabled={state.disabled}
                                        />
                                </FormGroup>
                            </Col>
                            <Col className="p-0">
                                <FormGroup>
                                    <Label name="title" className="w-100 h5 text-trans mb-2">Title:</Label>
                                        <Select
                                            title={state.title}
                                            list={state.titleList}
                                            resetThenSet={resetThenSet}
                                            className={state.disabled ? " profile" : ""}
                                            disabled={state.disabled}
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
                        <FormGroup className="mb-md-4 mb-3">
                            {/* <Col className="p-0 d-flex justify-content-center justify-content-md-start"> */}
                                <Label className="w-100 h5 text-trans mb-2">User Name:</Label>
                                {/* <Button
                                    type="button"
                                    className="big-2 badge-pill bg-transparent mb-2 ml-4 btn btn-secondary btn-outline-light p-0 minus"
                                    innerRef={minusUsrRef}
                                    onClick={e => setState({...state, disabledUsr: !state.disabledUsr})}
                                    onMouseUp={() => {
                                        minusUsrRef.current.style.display = 'none';
                                        closeUsrRef.current.style.display = 'inline-block';
                                    }}
                                >
                                    <span></span><span></span>
                                </Button>
                                <Button
                                    type="button"
                                    className="btn-close-pass badge-pill bg-transparent mb-2 ml-4 btn btn-secondary btn-outline-light p-0"
                                    aria-label="Close"
                                    innerRef={closeUsrRef}
                                    onClick={() => setState({...state, disabledUsr: !state.disabledUsr})}
                                    onMouseUp={() => {
                                        closeUsrRef.current.style.display = 'none';
                                        minusUsrRef.current.style.display = 'inline-block';
                                    }}
                                >
                                    <span></span><span></span>
                                </Button>
                            </Col> */}
                            <Row>
                                <Col style={{left: -0.3 + "rem"}}>
                                    <Input
                                        className="badge-pill text-trans bg-transparent text-center text-md-left profile"
                                        type="text"
                                        placeholder={state.userName}
                                        required
                                        onChange={e => setState({...state, userName: e.target.value})}
                                        value={state.userName}
                                        disabled={true}
                                    />
                                </Col>
                            </Row>
                        </FormGroup>
                        <Col className="p-0">
                            <FormGroup>
                                <Label name="birthday" className="w-100 h5 text-trans mb-2">Birthday:</Label>
                                    <DatePicker
                                        dateFormat="dd.MM.yyyy"
                                        className={"birthday badge-pill bg-transparent text-center text-md-left" + (state.disabled ? " profile" : "")}
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
                                        disabled={state.disabled}
                                    />
                            </FormGroup>
                        </Col>
                    </Col>
                    <Col className="p-0 pl-md-5 mt-3 mt-md-0 text-center text-md-left">
                        <h4>Addresses</h4>
                        <FormGroup className="mb-md-4 mb-3">
                            <Label className="w-100 h5 text-trans mb-2">Street:</Label>
                            <Row>
                                <Col style={{left: -0.3 + "rem"}}>
                                    <Input
                                        className={"badge-pill text-trans bg-transparent text-center text-md-left" + (state.disabled ? " profile" : "")}
                                        type="text"
                                        placeholder={state.street}
                                        onChange={e => setState({...state, street: e.target.value})}
                                        value={state.street}
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
                        <FormGroup className="mb-md-4 mb-3">
                            <Label className="w-100 h5 text-trans mb-2">Zip Code:</Label>
                            <Row>
                                <Col style={{left: -0.3 + "rem"}}>
                                    <Input
                                        className={"badge-pill text-trans bg-transparent text-center text-md-left" + (state.disabled ? " profile" : "")}
                                        type="text"
                                        placeholder={state.zip}
                                        onChange={e => setState({...state, zip: e.target.value})}
                                        value={state.zip}
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
                        <FormGroup className="mb-md-4 mb-3">
                            <Col className="p-0 d-flex justify-content-center justify-content-md-start">
                                <Label className="h5 text-trans mb-2">Email:</Label>
                                <Button
                                    type="button"
                                    className="big-2 badge-pill bg-transparent ml-4 btn btn-secondary btn-outline-light p-0 plus"
                                    innerRef={plusEmailRef}
                                    onClick={e => setState({...state, disabledEmail: !state.disabledEmail})}
                                    onMouseUp={() => {
                                        plusEmailRef.current.style.display = 'none';
                                        closeEmailRef.current.style.display = 'inline-block';
                                    }}
                                >
                                    <span></span><span></span>
                                </Button>
                                <Button
                                    type="button"
                                    className="btn-close-pass badge-pill bg-transparent ml-4 btn btn-secondary btn-outline-light p-0"
                                    aria-label="Close"
                                    innerRef={closeEmailRef}
                                    onClick={() => setState({...state, disabledEmail: !state.disabledEmail})}
                                    onMouseUp={() => {
                                        closeEmailRef.current.style.display = 'none';
                                        plusEmailRef.current.style.display = 'inline-block';
                                    }}
                                >
                                    <span></span><span></span>
                                </Button>
                            </Col>
                            <Row>
                                <Col style={{left: -0.3 + "rem"}}>
                                    <Input
                                        className={"badge-pill text-trans bg-transparent text-center text-md-left" + (state.disabledEmail ? " profile" : "")}
                                        type="email"
                                        placeholder={state.email}
                                        required
                                        onChange={e => setState({...state, email: e.target.value})}
                                        value={state.email}
                                        disabled={state.disabledEmail}
                                    />
                                </Col>
                            </Row>
                        </FormGroup>
                    </Col>
                    <Col className="p-0 pr-md-5 mt-3 text-center text-md-left">
                        <h4>Password</h4>
                    </Col>
                    {/* <Col xs="12" sm={{size: 8, offset: 2}} lg={{size: 6, offset: 3}} xl={{size: 4, offset: 4}} className="p-0"> */}
                </Row>
                <Row xs="1" md="2" className="m-auto">
                    <Col className="p-0 pr-md-5 text-center text-md-left">
                        <FormGroup className="mb-md-4 mb-3">
                            <Col className="p-0 d-flex justify-content-center justify-content-md-start">
                                <Label className="h5 text-trans mb-2">Password:</Label>
                                <Button
                                    type="button"
                                    className="big-2 badge-pill bg-transparent ml-4 btn btn-secondary btn-outline-light p-0 minus"
                                    innerRef={minusPassRef}
                                    onClick={e => setState({...state, disabledPass: !state.disabledPass})}
                                    onMouseUp={() => {
                                        minusPassRef.current.style.display = 'none';
                                        closePassRef.current.style.display = 'inline-block';
                                    }}
                                >
                                    <span></span><span></span>
                                </Button>
                                <Button
                                    type="button"
                                    className="btn-close-pass badge-pill bg-transparent ml-4 btn btn-secondary btn-outline-light p-0"
                                    aria-label="Close"
                                    innerRef={closePassRef}
                                    onClick={() => setState({...state, disabledPass: !state.disabledPass})}
                                    onMouseUp={() => {
                                        closePassRef.current.style.display = 'none';
                                        minusPassRef.current.style.display = 'inline-block';
                                    }}
                                >
                                    <span></span><span></span>
                                </Button>
                            </Col>
                            <Row>
                                <Col style={{left: -0.3 + "rem"}}>
                                    <Input
                                        className="badge-pill text-trans bg-transparent text-center text-md-left"
                                        type="password"
                                        placeholder={state.password.slice(0, 6)}
                                        required
                                        value={state.password.slice(0, 6)}
                                        disabled="disabled"
                                        style={{border:'none'}}
                                    />
                                </Col>
                            </Row>
                        </FormGroup>
                        <FormGroup className={"mb-md-4 mb-3" + (state.disabledPass ? " hidden" : "")}>
                            <Label className="w-100 h5 text-trans mb-2">Old Password:</Label>
                            <Row>
                                <Col style={{left: -0.3 + "rem"}}>
                                    <Input
                                        className={"badge-pill text-trans bg-transparent text-center text-md-left" + (state.disabledPass ? " profile" : "")}
                                        type="password"
                                        required
                                        onChange={e => setState({...state, repassword: e.target.value})}
                                        value={state.repassword}
                                    />
                                </Col>
                            </Row>
                        </FormGroup>
                    </Col>
                    <Col className="p-0 pl-md-5 text-center text-md-left">
                        <FormGroup className={"mb-md-4 mb-3" + (state.disabledPass ? " hidden" : "")}>
                            <Label className="w-100 h5 text-trans mb-2">New Password:</Label>
                            <Row>
                                <Col style={{left: -0.3 + "rem"}}>
                                    <Input
                                        className={"badge-pill text-trans bg-transparent text-center text-md-left" + (state.disabledPass ? " profile" : "")}
                                        type="password"
                                        required
                                        onChange={e => setState({...state, newPassword: e.target.value})}
                                        value={state.newPassword}
                                    />
                                </Col>
                            </Row>
                        </FormGroup>
                        <FormGroup className={"mb-4" + (state.disabledPass ? " hidden" : "")}>
                            <Label className="w-100 h5 text-trans mb-2">Repeat New Password:</Label>
                            <Row>
                                <Col style={{left: -0.3 + "rem"}}>
                                    <Input
                                        className={"badge-pill text-trans bg-transparent text-center text-md-left" + (state.disabledPass ? " profile" : "")}
                                        type="password"
                                        required
                                        onChange={e => setState({...state, renewPassword: e.target.value})}
                                        value={state.renewPassword}
                                    />
                                </Col>
                            </Row>
                        </FormGroup>
                    </Col>
                </Row>
                <Col xs="12" className={"text-center text-trans" + (state.disabled ? " hidden" : "")}>
                    <Button
                        type="submit"
                        className="big-1 badge-pill bg-transparent my-4 btn btn-secondary btn-outline-light p-0 plus"
                        onClick={onEditBtnClick}
                    >
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
