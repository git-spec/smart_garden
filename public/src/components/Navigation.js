/* ********************************************************* IMPORT ********************************************************* */
// react
import React, {Fragment, useState, useEffect, useRef} from 'react';
// redux
import {connect} from 'react-redux';
import {setSocketAction, setUserAction} from '../actions';
// router dom
import {Link, useHistory, useLocation} from 'react-router-dom';
// reactstrap
import {Container, Collapse, Navbar, NavbarToggler, NavbarBrand, Nav, NavItem, NavLink} from 'reactstrap';
// services
import {logoutPost} from '../services/api';
// window dimension hook
import {useWindowDimension} from '../services/useWindowDimension';

/* ******************************************************** COMPONENT ********************************************************* */
function Navigation(props) {
    const [width] = useWindowDimension();

/* *********************************************************** REFERENCE ********************************************************* */
    const openRefNAV = useRef();
    const openRefACC = useRef();
    const activeRef = useRef();

/* *********************************************************** STATE ********************************************************* */  
    const initialState = {
        isOpenNAV: true,
        isOpenACC: true,
        account: true,
        top: 0
    };
    const [state, setState] = useState(initialState);

/* *********************************************************** LOGOUT ********************************************************* */
    const history = useHistory();

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

/* ********************************************************* FUNCTIONS ********************************************************* */
    let prevScrollpos = window.pageYOffset;
    // set media query
    if (width <= 576) {
        window.onscroll = function() {
            let currentScrollPos = window.pageYOffset;
            if (prevScrollpos > currentScrollPos) {
                // show menubar while scroll up
                setState({...state, top: 0});
            } else {
                // hide menubar while scroll down
                setState({...state, top: '-50px'});
            }
            prevScrollpos = currentScrollPos;
        }
    } else {
        window.onscroll = false;
    }

/* ********************************************************* USE EFFECT ********************************************************* */
    // set outside listener
    useEffect(() => {
console.log(openRefACC.current.classList.contains(item => item === 'open'));
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
        <Navbar fixed="top" className="p-0 justify-content-center" style={{top: state.top}}>
            <Container className="mx-sm-5 mx-lg-0 px-md-5 px-lg-0 pt-1 mt-2 mt-sm-0">
{/* *********************************************************** LOGO ********************************************************* */}
                <div className="flex-grow-1">
                    <NavbarBrand className="m-0" title="home" tag={Link} to="/" />
                </div>
{/* *********************************************************** ACCOUNT ********************************************************* */}
                <NavLink title="account" className="p-0" onClick={toggleACC}>
                    <h4 className="d-flex text-align-center justify-content-center m-0">
                        <i className="far fa-user-circle account"></i>
                    </h4>
                </NavLink>
                {/* navbar toggle for devices smaller than 576px */}
                <NavbarToggler className="d-block p-0 py-3 ml-2" onClick={toggleNAV}>
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

const mapStateToProps = state => {
    return {
        user: state.user,
        socket: state.socket
    };
};
export default connect(mapStateToProps, {setUserAction, setSocketAction})(Navigation);
