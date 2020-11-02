import React, {useEffect} from 'react';
import {useParams, Link, useHistory} from 'react-router-dom';
import {sendParams} from '../services/api';

const Verification = () => {
    const params = useParams();
    const history = useHistory();

    useEffect(() => {
        sendParams(params.email).then(data => {
            if (data !== 2) {
                history.push('/login');
            } else {
                history.push('/register');
            }
        }).catch(err => {
            history.push('/register');
        });
    }, [history, params.email]);

    return (
        <React.Fragment>
            <div className="breadcrumb">
                <p>Thanks for registering!</p>
                <div className="container">
                    <Link className="breadcrumb-item" to="/login">
                        Login
                    </Link>
                </div>
            </div>
        </React.Fragment>
    );
};

export default Verification;
