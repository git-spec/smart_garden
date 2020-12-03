/* ********************************************************* IMPORT ********************************************************* */
// react
import React, {useState, Fragment} from 'react';
// redux
import {connect} from 'react-redux';
import {setSocketAction, setUserAction} from '../actions';
// router dom
import {Link, useHistory, useLocation} from 'react-router-dom';
// reactstrap
import {Container, Collapse, Navbar, NavbarToggler, NavbarBrand, Nav, NavItem, NavLink} from 'reactstrap';
// services
import {logoutPost} from '../services/api';

/* ******************************************************** COMPONENT ********************************************************* */
function Navigation(props) {

/* *********************************************************** REFERENCES ********************************************************* */
    const toggleNavbarRef = React.createRef();
    const toggleMenuIconRef = React.createRef();

/* *********************************************************** STATE ********************************************************* */
    const initialState = {
        collapsed: true
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
        toggleNavbar();
    };

/* *********************************************************** TOGGLES ********************************************************* */
    // set menu point active and toggle collapse
    const toggleNavbar = () => {
        setState({...state, collapsed: !state.collapsed});
        toggleNavbarRef.current.classList.toggle('active');
        toggleMenuIconRef.current.classList.toggle('open');
    };
    // close menubar
    const toggleNavbarBlur = e => {
        // if(e.relatedTarget === null){
        setState({...state, collapsed: true});
        toggleMenuIconRef.current.classList.remove('open');
        // }
    };

/* *********************************************************** NAV ITEMS ********************************************************* */
    let location = useLocation();

    const navItemsElement = (
        <Fragment>
            <NavItem active={location.pathname === '/' ? true : false}>
                <NavLink title="home" onClick={toggleNavbar} tag={Link} to="/">
                    home
                </NavLink>
            </NavItem>
            {props.user ? (
                <Fragment>
                    <NavItem active={location.pathname === '/user/dashboard' ? true : false}>
                        <NavLink title="dashboard" onClick={toggleNavbar} tag={Link} to="/user/dashboard">
                            dashboard
                        </NavLink>
                    </NavItem>
                    <NavItem active={location.pathname === '/user/profile' ? true : false}>
                        <NavLink title="profile" onClick={toggleNavbar} tag={Link} to="/user/profile">
                            profile
                        </NavLink>
                    </NavItem>
                    {props.user.role === 'admin' && (
                        <NavItem>
                            <NavLink tag={Link} to="/user/adminPanel">
                                panel
                            </NavLink>
                        </NavItem>
                    )}
                    {props.user.role === 'subadmin' && (
                        <NavItem>
                            <NavLink tag={Link} to="/user/subadminPanel">
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
                        <NavLink title="login" onClick={toggleNavbar} tag={Link} to="/login">
                            login
                        </NavLink>
                    </NavItem>
                    <NavItem active={location.pathname === '/register' ? true : false}>
                        <NavLink title="register" onClick={toggleNavbar} tag={Link} to="/register">
                            register
                        </NavLink>
                    </NavItem>
                </Fragment>
            )}
        </Fragment>
    );
/* *********************************************************** RETURN ********************************************************* */
    return (
        <Navbar onBlur={toggleNavbarBlur} fixed="top" className="px-0 justify-content-center">
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
                <NavbarToggler className="d-block p-0 py-3 ml-2" onClick={toggleNavbar}>
                    <div ref={toggleMenuIconRef} className="menu-icon">
                        <span></span><span></span><span></span>
                    </div>
                </NavbarToggler>
{/* *********************************************************** SIDEBAR ********************************************************* */}
                <div ref={toggleNavbarRef} className="sidebar">
                    <Nav vertical className="mx-3">
                        {navItemsElement}
                    </Nav>
                </div>
{/* *********************************************************** TOPBAR ********************************************************* */}
                <Collapse className="topbar" isOpen={!state.collapsed} navbar>
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
