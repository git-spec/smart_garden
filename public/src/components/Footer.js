// react
import React from "react";
// redux
import { connect } from "react-redux";
// router dom
import { Link, withRouter} from "react-router-dom";
// reactstrap
import {
    Col
} from "reactstrap";

function Footer({location}) {
    if(location.pathname !== '/'){
        return (
            <div>
                <Col className="d-flex justify-content-center mt-5 mb-2">
                    <Link to="https://www.youtube.com" className="mx-2"><i className="fab fa-youtube"></i></Link>
                    <Link to="https://www.instagram.com" className="mx-2"><i className="fab fa-instagram"></i></Link>
                    <Link to="https://www.facebook.com" className="mx-2"><i className="fab fa-facebook"></i></Link>
                </Col>
                <Col className="d-flex justify-content-center pb-5">
                    <Link to="/Kontakt"  className="mx-3">Contact</Link>
                    <Link to="/impressum" className="mx-3">Terms and Conditions</Link>
                    <Link to="/AGB" className="mx-3">About</Link>
                </Col>
            </div>
        );
    } else {
        return(null)
    }    
}
const mapStateToProps = (state) => {
    return { user: state.user };
};

export default connect(mapStateToProps)(withRouter(Footer));
