import React, {useEffect} from 'react';
import {useHistory} from 'react-router-dom';
// redux
import {connect} from 'react-redux';
import {setUserAction} from '../actions';
// services
import {checkLoginPost} from '../services/api';
const CheckLogin = props => {
    const {setUserAction} = props;
    const history = useHistory();
    useEffect(() => {
        checkLoginPost().then(data => {
            if (data === 10) {
                history.push('/login');
            } else {
                setUserAction(data);
            }
        }).catch(err => {
            history.push('/login');
        });
    // eslint-disable-next-line
    }, []);
    // }, [history, setUserAction]);
    let output = (<><h1>Loading...</h1></>)
    if (props.user) {
        output = props.children;
    }
    return output
};
const mapStateToProps = state => {
    return {user: state.user};
};
export default connect(mapStateToProps, {setUserAction})(CheckLogin);