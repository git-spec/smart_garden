// react
import React, {Fragment} from "react";
// redux
import { connect } from "react-redux";
// router dom
import { Link} from "react-router-dom";
// reactstrap
import {
    Container,
    Col,
    Row,
} from "reactstrap";

function Footer() {
    /* *********************************************************** RETURN ********************************************************* */
    return (
        <Fragment>
            <Container>
                <br/><br/><br/>
                    <Col lg="12"> 
                    <Row>
                    <Col lg="5"></Col>
                    <Col lg="1"><h4><a href="https://www.youtube.com"><i className="fab fa-youtube"></i></a></h4></Col>               
                    <Col lg="1"><h4><a href="https://www.instagram.com"><i className="fab fa-instagram"></i></a></h4></Col> 
                    <Col lg="1"><h4><a href="https://www.facebook.com"><i className="fab fa-facebook"></i></a></h4> </Col>

                    </Row>
                    </Col>
                    <br/>
                <Row>

                    <Col lg="3"></Col>
                    <Col lg="3"> <Link to="/impressum">Impressum</Link></Col>
                    <Col lg="2"> <Link to="/AGB">AGB</Link></Col>
                    <Col lg="2"> <Link to="/Kontakt">Kontakt</Link></Col>
                </Row>

               
            </Container>
            <br/><br/>

        </Fragment>
    );
}
const mapStateToProps = (state) => {
    return { user: state.user };
};
export default connect(mapStateToProps)(Footer);
