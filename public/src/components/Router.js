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
import Main from './Main';
import CheckLogin from './CheckLogin';
import Register from './Register';
import Login from './Login';
import Verification from './Verification';
import Password from './Password'
import Reset from './Reset'
import ErrorPage from './ErrorPage';
import Products from './Products';
import User from './User';
import Admin from './Admin';
import SubAdmin from './SubAdmin';
import Impressum from './Impressum';
import AGB from './AGB';
import Kontakt from './Kontakt';
import Fader from './Fader'

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

        divRef.current.style.visibility = 'hidden';

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
            <Navigation />
            <Fader>
                <Switch>
                    <Route path="/" exact component={Main} />
                    <Route path="/AGB" exact component={AGB} />
                    <Route path="/impressum" exact component={Impressum} />
                    <Route path="/kontakt" exact component={Kontakt} />
                    <Route path="/register" exact component={Register} />
                    <Route path="/login" exact component={Login} />
                    <Route path="/verify/:email" exact component={Verification} />
                    <Route path='/password' exact component={Password} />
                    <Route path='/reset/:id/:email' exact component={Reset} />
                    <Route path="/user/adminpanel" exact component={() => <CheckLogin><Admin /></CheckLogin>} />
                    <Route path="/user/subadminpanel" exact component={() => <CheckLogin><SubAdmin /></CheckLogin>} />
                    <Route path="/user/profile" exact component={() => <CheckLogin><User /></CheckLogin>} />
                    <Route path="/user/dashboard" exact component={() => <CheckLogin><Products /></CheckLogin>} />
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
