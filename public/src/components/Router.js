import React, {useEffect} from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
// redux
import {connect} from 'react-redux';
import {setUserAction} from '../actions';
// services
import {checkLoginPost} from '../services/api';
// components
import Main from './Main';
import CheckLogin from './CheckLogin';

import Register from './Register';
import Login from './Login';
import Verification from './Verification';

import Hubs from './Hubs';
import Devices from './Devices';

function Router(props) {
    // run at initial render
    useEffect(() => {
        checkLoginPost().then(data => {
            console.log(data);
            // not 10: user is logged in
            if (data !== 10) {
                props.setUserAction(data);
            }
        });
    }, []);

    return (
        <BrowserRouter>
            <Switch>
                <Route path="/" exact component={Main} />
                <Route path="/register" exact component={Register} />
                <Route path="/login" exact component={Login} />
                <Route path="/verify/:email" exact component={Verification} />
                {/* <Route path="/user/hubs" exact component={Hubs} /> */}
                <Route path="/user/hubs" exact component={() => <CheckLogin><Hubs /></CheckLogin>} />
                {/* <Route path="/user/hub/:id" exact component={Devices} /> */}
                <Route path="/user/hub/:id" exact component={() => <CheckLogin><Devices /></CheckLogin>} />
            </Switch>
        </BrowserRouter>
    );
}

export default connect(null, { setUserAction })(Router);