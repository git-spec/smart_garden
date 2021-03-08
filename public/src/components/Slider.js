import React, {useRef} from 'react';
import useSlider from '../hooks/useSlider';
// redux
import {connect} from 'react-redux';
import {setSlideAni1Action, setSlideAni2Action, setSlideAni3Action} from '../actions';

const Slider = props => {
    // refs
    const slideImage = useRef(null);
    const slideTitle = useRef(null);
    const slideText = useRef(null);
    const slideClass = useRef(null);
    const slideBtn = useRef(null);
    const slideFeat = useRef(null);

    // change background-color of body
    const slideIdx = (newIdx) => {
        switch (newIdx) {
            case 0:
                props.setSlideAni1Action('slide-ani-1');
                document.body.classList.remove('color-4');
                document.body.classList.remove('color-5');
                document.body.classList.remove('color-8');
                document.body.classList.add('color-1');
                break;
            case 1:
                props.setSlideAni2Action('slide-ani-2');
                document.body.classList.remove('color-1');
                document.body.classList.remove('color-5');
                document.body.classList.remove('color-8');
                document.body.classList.add('color-4');
                break;
            case 2:
                props.setSlideAni2Action('slide-ani-3');
                document.body.classList.remove('color-1');
                document.body.classList.remove('color-4');
                document.body.classList.remove('color-5');
                document.body.classList.add('color-8');
                break;
            default:
                break;
        };
    };
    // hook useSlider
    const {goToPreviousSlide, goToNextSlide, goToSlide} = useSlider(slideFeat, slideImage, slideTitle, slideText, slideClass, slideBtn, slideIdx, props.images);
console.log(props);

    return (
        <div className="slider" ref={slideImage}>
            <div className="slider-content d-flex justify-content-between position-relative">
                <button onClick={goToPreviousSlide} className="slider-btn-left d-flex align-items-center ml-2">
                    <div className="position-relative">
                        <span className="position-absolute"></span><span className="position-absolute"></span>
                    </div>
                    {/* <i className="fas fa-angle-left"></i> */}
                </button>
                <div className="slider-wrapper d-flex flex-column align-items-end">
                    <div ref={slideFeat} className="slider-feature align-self-center mb-auto">
                        <div ref={slideTitle} className="feature-title"></div>
                        <div ref={slideText} className="feature-text"></div>
                        {/* <button ref={slideBtn} className="feature-btn badge-pill px-3"></button> */}
                        <div className="feature-btn-wrapper mb-3">
                            <a ref={slideBtn} href="" className="feature-btn badge-pill px-3" />
                        </div>
                    </div>
                    <div ref={slideClass} className="slider-btn-wrapper align-self-center">
                        {props.images.map((e, idx) => {
                            return (
                                <button
                                    key={idx}
                                    onClick={() => goToSlide(idx)}
                                    className="slider-btn mx-2 mb-4"
                                />
                            );
                        })}
                    </div>
                </div>
                <button onClick={goToNextSlide} className="slider-btn-right mr-2">
                    <div className="position-relative">
                        <span className="position-absolute"></span><span className="position-absolute"></span>
                    </div>
                    {/* <i className="fas fa-angle-right"></i> */}
                </button>
            </div>
        </div>
    );
};

/* ********************************************************* MAP STATE TO PROPS ********************************************************* */
const mapStateToProps = state => {
    return {
        // slideAni1: state.slideAni1,
        // slideAni2: state.slideAni2,
        // slideAni3: state.slideAni3
    };
};

/* ********************************************************* EXPORT ********************************************************* */
export default connect(mapStateToProps, {setSlideAni1Action, setSlideAni2Action, setSlideAni3Action})(Slider);