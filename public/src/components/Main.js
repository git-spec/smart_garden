import React, {Fragment, useEffect} from 'react';
// redux
import {connect} from "react-redux";
import {setBackgroundImageAction} from '../actions';
import {setBackgroundColor5Action} from '../actions';
import {setBackgroundColor1Action} from '../actions';
// import Slider from "./Slider"
// import Images from "./images"
import {Link} from 'react-router-dom';

function Main(props) {

    useEffect(() => {
        props.setBackgroundImageAction("../imgs/800px_COLOURBOX10774649.jpg");
        props.setBackgroundColor5Action(null);
        props.setBackgroundColor1Action(null);
    // eslint-disable-next-line
    }, []);

    return(
        <Fragment>
            {/* <Slider images={Images} className={`${props.backgroundColor} ${props.backgroundColor100} ${props.backgroundColor70}`} /> */}
            <div className="bg-image" style={{width: "100vw", height: "100vh"}}></div>
            <article>
                <h2>Welcome to the world of planting!</h2>
                <p style={{fontSize: "1.2rem"}}>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.</p>
                <Link tag={Link} to="/register"><h4 className="mb-0">Register</h4></Link>
            </article>
        </Fragment>
    );
}
const mapStateToProps = state => {
    return {
        backgroundUrl: state.backgroundUrl,
        backgroundColor: state.backgroundColor5,
        backgroundColor100: state.backgroundColor1
    };
};
export default connect(mapStateToProps, {setBackgroundImageAction, setBackgroundColor5Action, setBackgroundColor1Action})(Main);