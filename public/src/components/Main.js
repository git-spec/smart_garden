import React, {Fragment, useEffect} from 'react';
// redux
import {connect} from "react-redux";
import {setBackgroundImageAction} from '../actions';
import {setBackgroundColor5Action} from '../actions';
import {setBackgroundColor1Action} from '../actions';
import Slider from "./Slider"
import Images from "./images"

function Main(props) {

    useEffect(() => {
        props.setBackgroundImageAction("../imgs/800px_COLOURBOX10774649.jpg");
        props.setBackgroundColor5Action(null);
        props.setBackgroundColor1Action(null);
    // eslint-disable-next-line
    }, []);

    return(
        <Fragment>
            <Slider images={Images} className={`${props.backgroundColor} ${props.backgroundColor100} ${props.backgroundColor70}`} />
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