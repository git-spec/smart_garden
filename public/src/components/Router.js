/* ********************************************************* IMPORT ********************************************************* */
// react
import React, {useEffect} from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
// redux
import {connect} from 'react-redux';
import {setUserAction} from '../actions';
// services
import {checkLoginPost} from '../services/api';
// components
import Navigation from './Navigation';
import Footer from './Footer';
import Fader from './Fader';
import ScrollTop from './ScrollTop';

import Main from './Main';

import Register from './Register';
import Login from './Login';
import CheckLogin from './CheckLogin';

import UserVerification from './UserVerification';
import ForgotPassword from './ForgotPassword'
import ResetPassword from './ResetPassword'

import Dashboard from './Dashboard';
import UserProfile from './UserProfile';

import Admin from './Admin';
import SubAdmin from './SubAdmin';

import About from './About';
import Contact from './Contact';
import Terms from './Terms';
import Protection from './Protection';

import ErrorPage from './ErrorPage';

/* ******************************************************** COMPONENT ********************************************************* */
const Router = props => {

    const {setUserAction} = props;

    useEffect(() => {
        // The system checks whether the user is properly logged in.  
        // If so, the user data is written to the mainstate of redux.
        checkLoginPost().then(data => {
            if (data !== 10) {
                setUserAction(data);
            }
        });
    // eslint-disable-next-line
    }, []);
    // change background-color of body
    if (props.backgroundColor1) {
        document.body.classList.remove('color-5')
        document.body.classList.add(props.backgroundColor1)
    } else if (props.backgroundColor5) {
        document.body.classList.remove('color-1')
        document.body.classList.add(props.backgroundColor5)
    } else {
        document.body.classList.remove('color-1')
        document.body.classList.remove('color-5')
    };

/* ******************************************************** RETURN ********************************************************* */
return (
        <BrowserRouter>
            <ScrollTop />
            <Fader>
                <Navigation />
                <Switch>
                    <Route path="/" exact component={Main} />
                    <Route path="/register" exact component={Register} />
                    <Route path="/login" exact component={Login} />
                    <Route path="/verify/:email" exact component={UserVerification} />
                    <Route path='/password' exact component={ForgotPassword} />
                    <Route path='/reset/:id/:email' exact component={ResetPassword} />
                    <Route path="/user/profile" exact component={() => <CheckLogin><UserProfile /></CheckLogin>} />
                    <Route path="/user/admin" exact component={() => <CheckLogin><Admin /></CheckLogin>} />
                    <Route path="/user/subadmin" exact component={() => <CheckLogin><SubAdmin /></CheckLogin>} />
                    <Route path="/user/dashboard" exact component={() => <CheckLogin><Dashboard /></CheckLogin>} />
                    <Route path="/about" exact component={About} />
                    <Route path="/contact" exact component={Contact} />
                    <Route path="/terms" exact component={Terms} />
                    <Route path="/protection" exact component={Protection} />
                    <Route path="/" component={ErrorPage} />
                </Switch>
                <Footer />
            </Fader>
        </BrowserRouter>
    );
}

/* ********************************************************* MAP STATE TO PROPS ********************************************************* */
const mapStateToProps = state => {
    return {
        backgroundUrl: state.backgroundUrl,
        backgroundColor1: state.backgroundColor1,
        backgroundColor5: state.backgroundColor5,
        nav: state.nav
    };
};

/* ********************************************************* EXPORT ********************************************************* */
export default connect(mapStateToProps, {setUserAction})(Router);
