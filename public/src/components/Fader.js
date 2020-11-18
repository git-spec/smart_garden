import React , { useEffect, useRef } from 'react';
import {withRouter} from 'react-router-dom'

const Fader = (props) => {
    const fadeDiv = useRef(null)

    const fadeAnimation = () => {
        fadeDiv.current.classList.add("fadeIn")
        setTimeout(() => {
            fadeDiv.current.classList.remove("fadeIn")
        }, 700);
    }

    useEffect(() => {
        let unlisten = props.history.listen((location,action)=>{
            fadeAnimation()
        })
        return () => {
            unlisten();
        };
    });

    return (
        <div ref={fadeDiv} >
            {props.children}
        </div>
    );
}

export default withRouter(Fader);
