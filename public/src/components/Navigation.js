/* ********************************************************* IMPORT ********************************************************* */
// react
import React, {Fragment, useState, useEffect, useRef} from 'react';
// redux
import {connect, useSelector} from 'react-redux';
import {setSocketAction, setUserAction} from '../actions';
// router dom
import {Link, useHistory, useLocation} from 'react-router-dom';
// reactstrap
import {Container, Collapse, Navbar, NavbarToggler, NavbarBrand, Nav, NavItem, NavLink, Button} from 'reactstrap';
// services
import {logoutPost} from '../services/api';
// window dimension hook
import {useWindowDimension} from '../hooks/useWindowDimension';
// images
import {ReactComponent as AccountOutlined} from '../imgs/account_outlined.svg';
import {ReactComponent as AccountFilled} from '../imgs/account_filled.svg';

/* ******************************************************** COMPONENT ********************************************************* */
function Navigation(props) {

    // The screen width is determined by this hook and is used to make the component responsive. 
    const [width] = useWindowDimension();

/* *********************************************************** REFERENCE ********************************************************* */
    const openRefNAV = useRef();
    const openRefACC = useRef();
    const activeRef = useRef();
    const outlinedAccRef = useRef();
    const filledAccRef = useRef();

/* *********************************************************** STATE ********************************************************* */  
    const initialState = {
        isOpenNAV: true,
        isOpenACC: true,
        account: true,
        isEnter: true,
        scrollUp: null,
    };
    const [state, setState] = useState(initialState);
    const color5 = useSelector(state => state.backgroundColor5);

/* *********************************************************** LOGOUT ********************************************************* */
    const history = useHistory();

    // delete the user data stored in the mainstate of redux and redirect the user to the login page
    const logoutBtnClick = e => {
        e.preventDefault();
        logoutPost().then(data => {
            if (data === 10) {
                props.setUserAction(null);
                history.push('/login');
            }
        }).catch(err => {
            console.log(err);
        });
        toggleACC();
    };

/* *********************************************************** TOGGLES ********************************************************* */
    const toggleNAV = () => {
        if (!state.isOpenACC) {
            // close sidebar of acc
            openRefACC.current.classList.remove('open');
            setTimeout(() => {
                // toggle menu icon
                activeRef.current.classList.toggle('active');
                // toggle topbar of nav
                setState({...state, isOpenNAV: !state.isOpenNAV, account: false, isOpenACC: true});
                // toggle sidebar of nav
                openRefNAV.current.classList.toggle('open');
            }, 300);
        } else {
            // toggle menu icon
            activeRef.current.classList.toggle('active');
            // toggle topbar of nav
            setState({...state, isOpenNAV: !state.isOpenNAV, account: false, isOpenACC: true});
            // toggle sidebar of nav
            openRefNAV.current.classList.toggle('open');
        };
    };

    const toggleACC = () => {
        if (!state.isOpenNAV) {
            // close sidebar of nav
            openRefNAV.current.classList.remove('open');
            // deactivate menu icon
            activeRef.current.classList.remove('active');
            setTimeout(() => {
                // toggle topbar of acc
                setState({...state, isOpenNAV: true, account: true, isOpenACC: !state.isOpenACC});
                // toggle sidebar of acc
                openRefACC.current.classList.toggle('open');
            }, 300);
        } else {
            // toggle topbar of acc
            setState({...state, isOpenNAV: true, account: true, isOpenACC: !state.isOpenACC});
            // toggle sidebar of acc
            openRefACC.current.classList.toggle('open');
        };
    };

    const toggleAccIcon = e => {
        e.preventDefault();
        outlinedAccRef.current.style.display = 'none';
        filledAccRef.current.style.display = 'block';
    }

/* ********************************************************* FUNCTIONS ********************************************************* */
// change colour of background

// hide menubar at viewpoint <= 576px    
let prevScrollpos = Math.abs(window.pageYOffset);
    // set media query
    if (width <= 576) {
        window.onscroll = function() {
            let currentScrollPos = Math.abs(window.pageYOffset);
            if (prevScrollpos > currentScrollPos) {
                // show menubar while scroll up
                setState({...state, scrollUp: 0});
            } else if (prevScrollpos === 0) {
                setState({...state, scrollUp: 0});
            } else {
                // hide menubar while scroll down
                setState({...state, scrollUp: '-50px'});
            }
            prevScrollpos = currentScrollPos;
        }
    } else {
        window.onscroll = false;
    }

/* ********************************************************* USE EFFECT ********************************************************* */
    // show outlined account-icon
    useEffect(() => {
        outlinedAccRef.current.style.display = 'block';
        filledAccRef.current.style.display = 'none';
    // eslint-disable-next-line
    }, []);
    // set outside listener
    useEffect(() => {
        // toggle account-icon
        if (filledAccRef.current.style.display === 'block') {
            setTimeout(() => {
                outlinedAccRef.current.style.display = 'block';
                filledAccRef.current.style.display = 'none';
            }, 100);
        };
        // console.log(openRefACC.current.classList.contains(item => item === 'open'));
        document.addEventListener('click', globalClickListener);
        // cleanup 
        return () => {
            document.removeEventListener('click', globalClickListener);
        };
    // eslint-disable-next-line
    });
    // close menubar
    const globalClickListener = () => {
        if (activeRef.current) activeRef.current.classList.remove('active');
        if (openRefNAV.current) openRefNAV.current.classList.remove('open');
        if (openRefACC.current) openRefACC.current.classList.remove('open');
        // cleanup
        document.removeEventListener('click', globalClickListener);
        setState({...state, isOpenNAV: true, isOpenACC: true});
    }

/* *********************************************************** NAV ITEMS ********************************************************* */
    let location = useLocation();
    // navigation menu
    const menuNAV = (
        <Fragment>
            <NavItem active={location.pathname === '/' ? true : false}>
                <NavLink onClick={toggleNAV} title="home" tag={Link} to="/">
                    Home
                </NavLink>
            </NavItem>
            {props.user && (
                <Fragment>
                    <NavItem active={location.pathname === '/user/dashboard' ? true : false}>
                        <NavLink title="dashboard" onClick={toggleNAV} tag={Link} to="/user/dashboard">
                            Dashboard
                        </NavLink>
                    </NavItem>
                    {props.user.role === 'admin' && (
                        <NavItem active={location.pathname === '/user/admin' ? true : false}>
                            <NavLink onClick={toggleNAV} tag={Link} to="/user/admin">
                                Panel
                            </NavLink>
                        </NavItem>
                    )}
                    {props.user.role === 'subadmin' && (
                        <NavItem active={location.pathname === '/user/subadmin' ? true : false}>
                            <NavLink onClick={toggleNAV} tag={Link} to="/user/subadmin">
                                Panel
                            </NavLink>
                        </NavItem>
                    )}
                </Fragment>
            )}
        </Fragment>
    );
    // account menu
    const menuACC = (
        <Fragment>
            {props.user ? (
                <Fragment>
                    <NavItem active={location.pathname === '/user/profile' ? true : false}>
                        <NavLink title="profile" onClick={toggleACC} tag={Link} to="/user/profile">
                            Profile
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink title="logout" href="#" onClick={logoutBtnClick}>
                            Logout
                        </NavLink>
                    </NavItem>
                </Fragment>
            ) : (
                <Fragment>
                    <NavItem active={location.pathname === '/login' ? true : false}>
                        <NavLink onClick={toggleACC} title="login" tag={Link} to="/login">
                            Login
                        </NavLink>
                    </NavItem>
                    <NavItem active={location.pathname === '/register' ? true : false}>
                        <NavLink onClick={toggleACC} title="register" tag={Link} to="/register">
                            Register
                        </NavLink>
                    </NavItem>
                </Fragment>
            )}
        </Fragment>
    );

/* *********************************************************** RETURN ********************************************************* */
    return (
        <Navbar fixed="top" className={`p-0 m-0 justify-content-center ${props.backgroundColor5} ${props.backgroundColor1}`} style={{top: state.scrollUp}}>
            <Container className="px-4 px-sm-5 pt-1 mt-3 mt-sm-2">
{/* *********************************************************** LOGO ********************************************************* */}
                <div className="flex-grow-1">
                    <NavbarBrand className="m-0" title="home" tag={Link} to="/" />
                </div>
{/* *********************************************************** ACCOUNT ********************************************************* */}
                <Button title="Account" className="p-0" onClick={e => toggleACC(e)} onMouseDown={e => toggleAccIcon(e)}>
                    <h4 data-attribute='hidden' hidden={true} className="d-flex text-align-center justify-content-center m-0">
                        <AccountOutlined width="1.5rem" height="1.5rem" stroke={color5 ? "#1C2C22" : "#FDD79D"} ref={outlinedAccRef} />
                        <AccountFilled width="1.5rem" height="1.5rem" fill={color5 ? "#1C2C22" : "#FDD79D"} ref={filledAccRef} />
                    </h4>
                </Button>
                {/* navbar toggle for devices smaller than 576px */}
                <NavbarToggler title="Menu" className="d-block p-0 py-3 ml-4" onClick={toggleNAV}>
                    <div ref={activeRef} className="menu-icon">
                        <span></span><span></span><span></span>
                    </div>
                </NavbarToggler>
{/* *********************************************************** SIDEBAR ********************************************************* */}
                <div ref={openRefNAV} className="sidebar text-center">
                    <Nav vertical className="mx-3">
                        {menuNAV}
                    </Nav>
                </div>
{/* *********************************************************** SIDEBAR ********************************************************* */}
                <div ref={openRefACC} className="sidebar text-center">
                    <Nav vertical className="mx-3">
                        {menuACC}
                    </Nav>
                </div>
{/* *********************************************************** TOPBAR ********************************************************* */}
                <Collapse className="topbar" isOpen={!state.isOpenNAV} navbar>
                    <Nav horizontal="center" vertical="align-items-end">
                        {menuNAV}
                    </Nav>
                </Collapse>
{/* *********************************************************** ACCOUNTBAR ********************************************************* */}
                <Collapse className="topbar" isOpen={!state.isOpenACC} navbar>
                    <Nav horizontal="center" vertical="align-items-end">
                        {menuACC}
                    </Nav>
                </Collapse>
            </Container>
        </Navbar>
    );
}

/* ********************************************************* MAP STATE TO PROPS ********************************************************* */
const mapStateToProps = state => {
    return {
        user: state.user,
        socket: state.socket,
        backgroundColor1: state.backgroundColor1,
        backgroundColor5: state.backgroundColor5,
        nav: state.nav
    };
};

/* ********************************************************* EXPORT ********************************************************* */
export default connect(mapStateToProps, {setUserAction, setSocketAction})(Navigation);
