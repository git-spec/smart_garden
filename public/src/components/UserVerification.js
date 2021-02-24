/* ********************************************************* IMPORT ********************************************************* */
// react
import React, {useEffect} from 'react';
// router dom
import {useParams, Link, useHistory} from 'react-router-dom';
// services
import {verifyUserPost} from '../services/api';

/* ********************************************************* COMPONENT ********************************************************* */
const UserVerification = () => {

    // hooks
    const params = useParams();
    const history = useHistory();

    // Changes the status of the user in the database to verified. 
    // If everything has worked, the user is taken to the login, otherwise to the register page.
    useEffect(() => {
        verifyUserPost(params.email).then(data => {
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

/* ********************************************************* RETURN ********************************************************* */
    return (
            <div className="breadcrumb">
                <p>Thanks for registering!</p>
                <div className="container">
                    <Link className="breadcrumb-item" to="/login">
                        Login
                    </Link>
                </div>
            </div>
    );
};

/* ********************************************************* EXPORT ********************************************************* */
export default UserVerification;
