/* ********************************************************* IMPORT ********************************************************* */
import React, {useEffect} from 'react';
import {useParams, Link, useHistory} from 'react-router-dom';
import {verifyUser} from '../services/api';

/* ********************************************************* COMPONENT ********************************************************* */
const UserVerification = () => {

    const params = useParams();
    const history = useHistory();

    useEffect(() => {
        verifyUser(params.email).then(data => {
            if (data !== 2) {
                history.push('/login');
            } else {
                history.push('/register');
            }
        }).catch(() => {
            history.push('/register');
        });
    // eslint-disable-next-line
    }, []);

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

export default UserVerification;
