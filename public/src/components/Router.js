/* ********************************************************* IMPORT ********************************************************* */
// react
import React, {useEffect,useRef} from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
// redux
import {connect} from 'react-redux';
import {setUserAction} from '../actions';
// services
import {checkLoginPost} from '../services/api';
// components
import Navigation from './Navigation';
import Footer from './Footer';
import Fader from './Fader'

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

import Terms from './Terms';
import About from './About';
import Contact from './Contact';

import ErrorPage from './ErrorPage';

/* ******************************************************** COMPONENT ********************************************************* */
const Router = props => {

    const divRef = useRef();
    const {setUserAction} = props;

    useEffect(() => {
        checkLoginPost().then(data => {
            if (data !== 10) { // user is logged in
                setUserAction(data);
            }
        });
        // hide navbar background
        divRef.current.style.visibility = 'hidden';
        // show navbar background
        window.addEventListener('scroll', e => {
            if(window.scrollY > 40) {
                divRef.current.style.visibility = 'visible';
            } else {
                divRef.current.style.visibility = 'hidden';
            };
        });
    // eslint-disable-next-line
    }, []);

/* ******************************************************** RETURN ********************************************************* */
return (
        <BrowserRouter>
            <div className={`${props.backgroundColor1} ${props.backgroundColor5}`} ref={divRef}></div>
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
                    <Route path="/contact" exact component={Contact} />
                    <Route path="/terms" exact component={Terms} />
                    <Route path="/about" exact component={About} />
                    <Route path="/" component={ErrorPage} />
                </Switch>
                <Footer />
            </Fader>
        </BrowserRouter>
    );
}

const mapStateToProps = state => {
    return {
        backgroundUrl: state.backgroundUrl,
        backgroundColor1: state.backgroundColor1,
        backgroundColor5: state.backgroundColor5
    };
};
export default connect(mapStateToProps, {setUserAction})(Router);
