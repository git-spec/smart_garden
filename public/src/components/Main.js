import React, {Fragment, useEffect} from 'react';
// redux
import {connect} from "react-redux";
import {setBackgroundImageAction} from '../actions';
import {setBackgroundColor100Action} from '../actions';
import {setBackgroundColor70Action} from '../actions';


function Main(props) {

    useEffect(() => {
        props.setBackgroundImageAction("../imgs/800px_COLOURBOX10774649.jpg");
        props.setBackgroundColor100Action(null);
        props.setBackgroundColor70Action(null);
    // eslint-disable-next-line
    }, []);

    return(
        <Fragment>
        </Fragment>
    );
}

export default connect(null, {setBackgroundImageAction, setBackgroundColor100Action, setBackgroundColor70Action})(Main);