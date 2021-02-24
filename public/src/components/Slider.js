import React, {useRef} from 'react';
import useSlider from '../hooks/useSlider';

const Slider = ({images}) => {
    // refs
    const slideImage = useRef(null);
    const slideTitle = useRef(null);
    const slideText = useRef(null);
    const slideClass = useRef(null);
    const slideBtn = useRef(null);
    // change background-color of body
    const slideIdx = (newIdx) => {
console.log(newIdx);
        switch (newIdx) {
            case 0:
                document.body.classList.remove('color-4');
                document.body.classList.remove('color-5');
                document.body.classList.remove('color-8');
                document.body.classList.add('color-1');
                break;
            case 1:
                document.body.classList.remove('color-1');
                document.body.classList.remove('color-5');
                document.body.classList.remove('color-8');
                document.body.classList.add('color-4');
                break;
            case 2:
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
    const {goToPreviousSlide, goToNextSlide, goToSlide} = useSlider(slideImage, slideTitle, slideText, slideClass, slideBtn, slideIdx, images);

    return (
        <div className="slider" ref={slideImage}>
            <div className="slider-content d-flex flex-wrap justify-content-between position-relative">
                <button onClick={goToPreviousSlide} className="slider-btn-left d-flex align-items-center ml-2">
                    <div className="position-relative">
                        <span className="position-absolute"></span><span className="position-absolute"></span>
                    </div>
                    {/* <i className="fas fa-angle-left"></i> */}
                </button>
                <div className="slider-feature slider1 position-absolute top-50 start-50 translate-middle">
                    <div ref={slideTitle} className="feature-title position-relative"></div>
                    <p ref={slideText} className="feature-text position-relative"></p>
                    <button ref={slideBtn} className="feature-btn badge-pill px-3"></button>
                </div>
                <div ref={slideClass} className="slider-btn-wrapper d-flex align-items-end">
                    {images.map((e, idx) => {
                        return (
                            <button
                                key={idx}
                                onClick={() => goToSlide(idx)}
                                className="slider-btn mx-2 mb-4"
                            />
                        );
                    })}
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

export default Slider;
