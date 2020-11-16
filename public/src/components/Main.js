import React, {Fragment, useEffect} from 'react';
// redux
import {connect} from "react-redux";
import {setBackgroundImageAction} from '../actions';
import {setBackgroundColorAction} from '../actions';
import {setBackgroundColor100Action} from '../actions';
import {setBackgroundColor70Action} from '../actions';


function Main(props) {

    useEffect(() => {
        props.setBackgroundImageAction("../imgs/800px_COLOURBOX10774649.jpg");
        props.setBackgroundColorAction(null);
        props.setBackgroundColor100Action(null);
        props.setBackgroundColor70Action(null);
    }, []);

    return(
        <Fragment>
        </Fragment>
    );
}

export default connect(null, {setBackgroundImageAction, setBackgroundColorAction, setBackgroundColor100Action, setBackgroundColor70Action})(Main);