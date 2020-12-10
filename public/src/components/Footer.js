/* ********************************************************* IMPORT ********************************************************* */
// react
import React from 'react';
// redux
import {connect} from 'react-redux';
// router dom
import {Link, withRouter} from 'react-router-dom';
// reactstrap
import {Col, Container} from 'reactstrap';

/* ******************************************************** COMPONENT ********************************************************* */
function Footer({location}) {
    if (location.pathname !== '/') {
        return (
            <Container fluid={true}>
                <Col className="d-flex justify-content-center mt-5 mb-2">
                    <a href="https://www.youtube.com" className="mx-2">
                        <i className="fab fa-youtube"></i>
                    </a>
                    <a href="https://www.instagram.com" className="mx-2">
                        <i className="fab fa-instagram"></i>
                    </a>
                    <a href="https://www.facebook.com" className="mx-2">
                        <i className="fab fa-facebook"></i>
                    </a>
                </Col>
                <Col className="d-flex justify-content-center pb-4">
                    <Link to="/about" className="mx-3">
                        About
                    </Link>
                    <Link to="/contact" className="mx-3">
                        Contact
                    </Link>
                    <Link to="/terms" className="mx-3">
                        Terms and Conditions
                    </Link>
                    <Link to="/protection" className="mx-3">
                        Data Protection
                    </Link>
                </Col>
            </Container>
        );
    } else {
        return null;
    }
}

/* ********************************************************* MAP STATE TO PROPS ********************************************************* */
const mapStateToProps = state => {
    return {user: state.user};
};

/* ********************************************************* EXPORT ********************************************************* */
export default connect(mapStateToProps)(withRouter(Footer));
