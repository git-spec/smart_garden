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
            <Container fluid={true} className="px-4 px-sm-5 mt-auto">
                <Col className="d-flex justify-content-center mt-4 mb-3 px-0">
                    <a href="https://www.youtube.com" className="mx-3">
                        <i className="fab fa-youtube"></i>
                    </a>
                    <a href="https://www.instagram.com" className="mx-3">
                        <i className="fab fa-instagram"></i>
                    </a>
                    <a href="https://www.facebook.com" className="mx-3">
                        <i className="fab fa-facebook"></i>
                    </a>
                </Col>
                <Col className="d-flex justify-content-center text-center pb-4 px-0">
                    <Link to="/about" className="mx-2 mx-md-3">
                        About
                    </Link>
                    <Link to="/contact" className="mx-2 mx-md-3">
                        Contact
                    </Link>
                    <Link to="/terms" className="mx-2 mx-md-3">
                        Terms &amp; Conditions
                    </Link>
                    <Link to="/protection" className="mx-2 mx-md-3">
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
