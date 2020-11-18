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




const Router = props => {

    const {setUserAction} = props;
    useEffect(() => {
        checkLoginPost().then(data => {
            // console.log('user:', data);
            if (data !== 10) { // user is logged in
                setUserAction(data);
            }
        });
    // eslint-disable-next-line
    }, []);

    return (
        <BrowserRouter>
            <Navigation />
            <Switch>
                <Route path="/" exact component={Main} />
                <Route path="/register" exact component={Register} />
                <Route path="/login" exact component={Login} />
                <Route path="/verify/:email" exact component={Verification} />
                <Route path='/password' exact component={Password} />
                <Route path='/reset/:id/:email' exact component={Reset} />
                <Route path="/AGB" exact component={AGB} />
                <Route path="/impressum" exact component={Impressum} />
                <Route path="/kontakt" exact component={Kontakt} />
                <Route path="/user/adminPanel" exact component={() => <CheckLogin><Admin /></CheckLogin>} />
                <Route path="/user/subadminPanel" exact component={() => <CheckLogin><SubAdmin /></CheckLogin>} />
                <Route path="/user" exact component={() => <CheckLogin><User /></CheckLogin>} />
                <Route path="/user/dashboard" exact component={() => <CheckLogin><Products /></CheckLogin>} />

                <Route path="/" component={ErrorPage} />
            </Switch>
            <Footer/>
        </BrowserRouter>
    );
}

export default connect(null, {setUserAction})(Router);
