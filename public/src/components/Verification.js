import React, {useEffect, useState} from 'react';
import {useParams, Link, useHistory} from 'react-router-dom';

import {sendParams} from '../services/api';

const Verification = () => {
    const params = useParams();
    const history = useHistory();

    useEffect(() => {
        sendParams(params.email).then(data => {
            console.log(data);
            if (data !== 2) {
                history.push('/login');
            } else {
                history.push('/register');
            }
        }).catch(err => {
            history.push('/register');
        });
    }, []);

    return (
        <React.Fragment>
            <div className="breadcrumb">
                <p>Thanks For Your Register</p>
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
