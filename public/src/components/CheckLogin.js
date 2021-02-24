/* ********************************************************* IMPORT ********************************************************* */
// react
import React, {useEffect} from 'react';
// router dom
import {useHistory} from 'react-router-dom';
// redux
import {connect} from 'react-redux';
import {setUserAction} from '../actions';
// services
import {checkLoginPost} from '../services/api';

/* ********************************************************* COMPONENT ********************************************************* */
const CheckLogin = props => {

    const history = useHistory();

    // Checks if the user is logged in and if there is a session. 
    // If so, the user is redirected to the secured component.
    // If not, the user is brought back to the login area.
    useEffect(() => {
        checkLoginPost().then(data => {
            if (data === 10) {
                history.push('/login');
            } else {
                props.setUserAction(data);
            }
        }).catch(() => {
            history.push('/login');
        });
    // eslint-disable-next-line
    }, []);

    if (props.user) {
        return props.children;
    } else {
        return <div>Loading...</div>;
    }
};

/* ********************************************************* MAP STATE TO PROPS ********************************************************* */
const mapStateToProps = state => {
    return {user: state.user};
};

/* ********************************************************* EXPORT ********************************************************* */
export default connect(mapStateToProps, {setUserAction})(CheckLogin);