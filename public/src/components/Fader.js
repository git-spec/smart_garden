import React , {useEffect, useRef} from 'react';
import {withRouter} from 'react-router-dom';
// redux
import {connect} from 'react-redux';

const Fader = props => {

    const fadeDiv = useRef(null);

    const fadeAnimation = () => {
        fadeDiv.current.classList.add("fadeIn");
        setTimeout(() => {
            fadeDiv.current.classList.remove("fadeIn");
        }, 700);
    }

    useEffect(() => {
        let unlisten = props.history.listen((location,action) => {
            fadeAnimation();
        })
        return () => {
            unlisten();
        };
    });

    return (
        <div ref={fadeDiv} className={`d-flex align-content-between flex-wrap justify-content-center ${props.backgroundColor5} ${props.backgroundColor1}`}>
            {props.children}
        </div>
    );
}

/* ********************************************************* MAP STATE TO PROPS ********************************************************* */
const mapStateToProps = state => {
    return {
        backgroundColor1: state.backgroundColor1,
        backgroundColor5: state.backgroundColor5
    };
};

/* ********************************************************* EXPORT ********************************************************* */
export default connect(mapStateToProps)(withRouter(Fader));
