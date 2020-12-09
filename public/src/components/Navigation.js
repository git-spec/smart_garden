/* ********************************************************* IMPORT ********************************************************* */
// react
import React, {Fragment, useState, useEffect, createRef} from 'react';
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
import {useWindowDimension} from '../hooks/useWindowDimension';

/* ******************************************************** COMPONENT ********************************************************* */
function Navigation(props) {
    const [width] = useWindowDimension();

/* *********************************************************** REFERENCE ********************************************************* */
    const openRef = createRef();
    const activeRef = createRef();

/* *********************************************************** STATE ********************************************************* */  
    const initialState = {
        isOpen: true,
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
        toggle();
    };

/* *********************************************************** TOGGLES ********************************************************* */
    const toggle = () => {
        // toggle sidebar
        openRef.current.classList.toggle('open');
        // toggle menu icon
        activeRef.current.classList.toggle('active');
        // toggle topbar
        setState({...state, isOpen: !state.isOpen});
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
        if (openRef.current) openRef.current.classList.remove('open');
        document.removeEventListener('click', globalClickListener);
        setState({...state, isOpen: true});
    }

/* *********************************************************** NAV ITEMS ********************************************************* */
    let location = useLocation();

    const navItemsElement = (
        <Fragment>
            <NavItem active={location.pathname === '/' ? true : false}>
                <NavLink onClick={toggle} title="home" tag={Link} to="/">
                    home
                </NavLink>
            </NavItem>
            {props.user ? (
                <Fragment>
                    <NavItem active={location.pathname === '/user/dashboard' ? true : false}>
                        <NavLink title="dashboard" onClick={toggle} tag={Link} to="/user/dashboard">
                            dashboard
                        </NavLink>
                    </NavItem>
                    <NavItem active={location.pathname === '/user/profile' ? true : false}>
                        <NavLink title="profile" onClick={toggle} tag={Link} to="/user/profile">
                            profile
                        </NavLink>
                    </NavItem>
                    {props.user.role === 'admin' && (
                        <NavItem active={location.pathname === '/user/admin' ? true : false}>
                            <NavLink onClick={toggle} tag={Link} to="/user/admin">
                                panel
                            </NavLink>
                        </NavItem>
                    )}
                    {props.user.role === 'subadmin' && (
                        <NavItem active={location.pathname === '/user/subadmin' ? true : false}>
                            <NavLink onClick={toggle} tag={Link} to="/user/subadmin">
                                panel
                            </NavLink>
                        </NavItem>
                    )}
                    <NavItem>
                        <NavLink title="logout" href="#" onClick={logoutBtnClick}>
                            logout
                        </NavLink>
                    </NavItem>
                </Fragment>
            ) : (
                <Fragment>
                    <NavItem active={location.pathname === '/login' ? true : false}>
                        <NavLink onClick={toggle} title="login" tag={Link} to="/login">
                            login
                        </NavLink>
                    </NavItem>
                    <NavItem active={location.pathname === '/register' ? true : false}>
                        <NavLink onClick={toggle} title="register" tag={Link} to="/register">
                            register
                        </NavLink>
                    </NavItem>
                </Fragment>
            )}
        </Fragment>
    );
/* *********************************************************** RETURN ********************************************************* */
    return (
        <Navbar fixed="top" className="px-0 justify-content-center" style={{top: state.top}}>
            <Container className="mx-sm-5 mx-lg-0 px-md-5 px-lg-0 mt-2 mt-sm-0">
{/* *********************************************************** LOGO ********************************************************* */}
                <div className="flex-grow-1">
                    <NavbarBrand className="m-0" title="home" tag={Link} to="/" />
                </div>
{/* *********************************************************** ACCOUNT ********************************************************* */}
                <NavLink title="login" tag={Link} to="/login" className=" p-0">
                    <h4 className="d-flex text-align-center justify-content-center m-0">
                        <i className="far fa-user-circle"></i>
                    </h4>
                </NavLink>
                {/* navbar toggle for devices smaller than 576px */}
                <NavbarToggler className="d-block p-0 py-3 ml-2" onClick={toggle}>
                    <div ref={activeRef} className="menu-icon">
                        <span></span><span></span><span></span>
                    </div>
                </NavbarToggler>
{/* *********************************************************** SIDEBAR ********************************************************* */}
                <div ref={openRef} className="sidebar">
                    <Nav vertical className="mx-3">
                        {navItemsElement}
                    </Nav>
                </div>
{/* *********************************************************** TOPBAR ********************************************************* */}
                <Collapse className="topbar" isOpen={!state.isOpen} navbar>
                    <Nav horizontal="center" vertical="align-items-end">
                        {navItemsElement}
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
