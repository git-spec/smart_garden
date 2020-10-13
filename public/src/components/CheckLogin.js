import React, {useEffect} from 'react';
import {useHistory} from 'react-router-dom';
// redux
import {connect} from 'react-redux';
import {setUserAction} from '../actions';
// services
import {checkLoginPost} from '../services/api';

const CheckLogin = props => {
    const history = useHistory();

    useEffect(() => {
        checkLoginPost().then(data => {
            if (data === 10) {
                history.push('/login');
            } else {
                props.setUserAction(data);
            }
        }).catch(err => {
            history.push('/login');
        });
    }, []);

    return props.children;
};

export default connect(null, {setUserAction})(CheckLogin);