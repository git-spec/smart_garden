import {useEffect} from 'react';
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
    }, [history, setUserAction]);

    return props.children;
};

export default connect(null, {setUserAction})(CheckLogin);