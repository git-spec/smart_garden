// import e from 'cors';
import {useEffect} from 'react';
  
/**
* Show selected slider and its index.
* @param {Object}   slideFeat   DOM Element of slider feature.
* @param {Object}   slideImage  DOM Element of slider image.
* @param {Object}   slideTitle  DOM Element of slider title.
* @param {Object}   slideText   DOM Element of slider text.
* @param {Object}   slideClass  DOM Element of slider button wrapper.
* @param {Object}   slideBtn    DOM Element of slider feature button.
* @param {Function} slideIdx    function to change background-color of body.
* @return {Function} selected slider and index.
*/
const useSlider = (slideFeat, slideImage, slideTitle, slideText, slideClass, slideBtn, slideIdx, images) => {
    let slideCounter = 0;
    let slides = [];

    useEffect(() => startSlider());
  
    /**
    * Set slider 1 at beginning.
    * @param {Object}   slideFeat   DOM Element of slider feature.
    * @param {Object}   slideImage  DOM Element of slider image.
    * @param {Object}   slideTitle  DOM Element of slider title.
    * @param {Object}   slideText   DOM Element of slider text.
    * @param {Object}   slideClass  DOM Element of slider button wrapper.
    * @param {Object}   slideBtn    DOM Element of slider feature button.
    * @param {Function} slideIdx    function to change background-color of body.
    * @return {Function} selected slider and index.
    */
    const startSlider =() => {
        slideImage.current.style.backgroundImage = `linear-gradient(
                                                        to right,
                                                        rgba(34, 34, 34, 0.4),
                                                        rgba(68, 68, 68, 0.4)
                                                    ), url(${images[0].src})`;
        if (!slides.includes('slide1')) {
            slideFeat.current.classList.add('slide-1', 'slide-ani-1');
            slides.push('slide1');
        } else {
            slideFeat.current.classList.add('slide-1');
        };
        slideFeat.current.classList.remove('slide-2', 'slide-ani-2', 'slide-3', 'slide-ani-3', 'container', 'px-2', 'px-md-5');
        slideTitle.current.innerHTML = images[0].title;
        slideText.current.innerHTML = images[0].text;
        slideBtn.current.innerHTML = images[0].button;
        slideBtn.current.href = '/register';
        animateSlide(0);
        handleClass(0);
        slideIdx(0);
    }

    const handleSlide = slide => {
        slideImage.current.style.backgroundImage = `linear-gradient(
                                                        to right,
                                                        rgba(34, 34, 34, 0.4),
                                                        rgba(68, 68, 68, 0.4)
                                                    ), url(${images[slide - 1].src})`;
        slideTitle.current.innerHTML = images[slide - 1].title;
        slideText.current.innerHTML = images[slide - 1].text;
        // if (slide - 1 == 1) {
        //     slideBtn.current.classList.add('slider2');
        // } else {
        //     slideBtn.current.classList.remove('slider2');
        //     slideBtn.current.innerHTML = images[slide - 1].button;
        // }
        switch (slide - 1) {
            case 0:
                if (!slides.includes('slide1')) {
                    slideFeat.current.classList.add('slide-1', 'slide-ani-1');
                    slides.push('slide1');
                } else {
                    slideFeat.current.classList.add('slide-1');
                };
                slideFeat.current.classList.remove('slide-2', 'slide-ani-2', 'slide-3', 'slide-ani-3', 'container', 'px-2', 'px-md-5');
                slideBtn.current.href = '/register';
                slideBtn.current.style.display = 'inline-block';
                slideBtn.current.innerHTML = images[slide - 1].button;
                animateSlide(slideImage);
                handleClass(slide - 1);
                slideIdx(slide - 1);
                break;
            case 1:
                if (!slides.includes('slide2')) {
                    slideFeat.current.classList.add('slide-2', 'slide-ani-2', 'container', 'px-2', 'px-md-5');
                    slides.push('slide2');
                } else {
                    slideFeat.current.classList.add('slide-2', 'container', 'px-2', 'px-md-5');
                };
                slideFeat.current.classList.remove('slide-1', 'slide-ani-1', 'slide-3', 'slide-ani-3');
                slideBtn.current.style.display = 'none';
                animateSlide(slideImage);
                handleClass(slide - 1);
                slideIdx(slide - 1);
                break;
            case 2:
                if (!slides.includes('slide3')) {
                    slideFeat.current.classList.add('slide-3', 'slide-ani-3', 'container', 'px-2', 'px-md-5');
                    slides.push('slide3');
                } else {
                    slideFeat.current.classList.add('slide-3', 'container', 'px-2', 'px-md-5');
                };
                slideFeat.current.classList.remove('slide-1', 'slide-ani-1', 'slide-2', 'slide-ani-2');
                slideBtn.current.style.display = 'inline-block';
                slideBtn.current.innerHTML = images[slide - 1].button;
                animateSlide(slideImage);
                handleClass(slide - 1);
                slideIdx(slide - 1);
                break;
            default:
                slideFeat.current.classList.remove('container', 'px-5');
                slideBtn.current.style.display = 'inline-block';
                slideBtn.current.innerHTML = images[slide - 1].button;
                animateSlide(slideImage);
                handleClass(slide - 1);
                slideIdx(slide - 1);
                break;
        }
        // if (slide - 1 === 1) {
        //     slideBtn.current.style.display = 'none';
        // } else {
        //     slideBtn.current.style.display = 'inline-block';
        //     slideBtn.current.innerHTML = images[slide - 1].button;
        // }
        // animateSlide(slideImage);
        // handleClass(slide - 1);
        // slideIdx(slide - 1);
    }

    const animateSlide = () => {
        slideImage.current.classList.add("fadeIn")
        setTimeout(() => {
            slideImage.current.classList.remove("fadeIn")
        }, 700);
    }

    const handleClass = idx => {
        if (idx === 0) {
            slideClass.current.childNodes.forEach(item => item.classList.remove('shown'));
            slideClass.current.childNodes[idx].classList.add('shown');
        }
        // slideFeat.current.classList.remove('slider1');
        slideClass.current.childNodes.forEach(item => item.classList.remove('shown'));
        slideClass.current.childNodes[idx].classList.add('shown');
    }

    const goToPreviousSlide = () => {
        // switch (slideCounter) {
        //     case 0:
        //         if (!slideFeat.current.classList.contains('slide-ani-1')) {
        //             slideFeat.current.classList.add('slide-ani-1');
        //         };
        //         handleSlide(images.length);
        //         slideCounter = images.length;
        //         break;
        //     case 1:
        //         if (!slideFeat.current.classList.contains('slide-ani-2')) {
        //             slideFeat.current.classList.add('slide-ani-2');
        //         };
        //         handleSlide(slideCounter);
        //         slideCounter--;
        //         break;
        //     case 2:
        //         if (!slideFeat.current.classList.contains('slide-ani-3')) {
        //             slideFeat.current.classList.add('slide-ani-3');
        //         };
        //         handleSlide(slideCounter);
        //         slideCounter--;
        //         break;
        //     default:
        //         handleSlide(slideCounter);
        //         slideCounter--;
        //         break;
        // }
        if (slideCounter === 0) {
            startSlider();
            slideCounter = images.length;
        }
        handleSlide(slideCounter);
        slideCounter--;
    }

    const goToSlide = (slide) => {
        slideImage.current.style.backgroundImage = `linear-gradient(
                                                    to right,
                                                    rgba(34, 34, 34, 0.4),
                                                    rgba(68, 68, 68, 0.4)
                                                    ),url(${images[slide].src})`;
        slideTitle.current.innerHTML = images[slide].title;
        slideText.current.innerHTML = images[slide].text;
        switch (slide) {
            case 0:
                if (!slides.includes('slide1')) {
                    slideFeat.current.classList.add('slide-1', 'slide-ani-1');
                    slides.push('slide1');
                } else {
                    slideFeat.current.classList.add('slide-1');
                };
                slideFeat.current.classList.remove('slide-2', 'slide-ani-2', 'slide-3', 'slide-ani-3', 'container', 'px-2', 'px-md-5');
                slideBtn.current.href = '/register';
                slideBtn.current.style.display = 'inline-block';
                slideBtn.current.innerHTML = images[slide].button;
                slideCounter = slide;
                animateSlide(slideImage);
                handleClass(slide);
                slideIdx(slide);
                break;
            case 1:
                if (!slides.includes('slide2')) {
                    slideFeat.current.classList.add('slide-2', 'slide-ani-2', 'container', 'px-2', 'px-2', 'px-md-5');
                    slides.push('slide2');
                } else {
                    slideFeat.current.classList.add('slide-2', 'container', 'px-2', 'px-md-5');
                };
                slideFeat.current.classList.remove('slide-1', 'slide-ani-1', 'slide-3' ,'slide-ani-3');
                slideBtn.current.style.display = 'none';
                slideCounter = slide;
                animateSlide(slideImage);
                handleClass(slide);
                slideIdx(slide);
                break;
            case 2:
                if (!slides.includes('slide3')) {
                    slideFeat.current.classList.add('slide-3', 'slide-ani-3', 'container', 'px-2', 'px-md-5');
                    slides.push('slide3');
                } else {
                    slideFeat.current.classList.add('slide-3', 'container', 'px-2', 'px-md-5');
                };
                slideFeat.current.classList.remove('slide-1', 'slide-ani-1', 'slide-2', 'slide-ani-2');
                slideBtn.current.style.display = 'inline-block';
                slideBtn.current.innerHTML = images[slide].button;
                slideCounter = slide;
                animateSlide(slideImage);
                handleClass(slide);
                slideIdx(slide);
                break;
            default:
                slideFeat.current.classList.remove('container', 'px-2', 'px-md-5');
                slideBtn.current.style.display = 'inline-block';
                slideBtn.current.innerHTML = images[slide].button;
                slideCounter = slide;
                animateSlide(slideImage);
                handleClass(slide);
                slideIdx(slide);
                break;
        }
        // if (slide === 1) {
        //     slideFeat.current.classList.add('slider2');
        //     slideBtn.current.style.display = 'none';
        // } else {
        //     slideFeat.current.classList.remove('slider2');
        //     slideBtn.current.style.display = 'inline-block';
        //     slideBtn.current.innerHTML = images[slide].button;
        // }
        // slideCounter = slide;
        // animateSlide(slideImage);
        // handleClass(slide);
        // slideIdx(slide);
    }

    const goToNextSlide = () => {
        if (slideCounter === images.length - 1) {
            startSlider()
            slideCounter = -1;
            animateSlide(slideImage);
        }

        slideImage.current.style.backgroundImage = `linear-gradient(
                                                    to right,
                                                    rgba(34, 34, 34, 0.4),
                                                    rgba(68, 68, 68, 0.4)
                                                    ),url(${images[slideCounter + 1].src})`;
        slideTitle.current.innerHTML = images[slideCounter + 1].title;
        slideText.current.innerHTML = images[slideCounter + 1].text;
        switch (slideCounter + 1) {
            case 0:
                if (!slides.includes('slide1')) {
                    slideFeat.current.classList.add('slide-1', 'slide-ani-1');
                    slides.push('slide1');
                } else {
                    slideFeat.current.classList.add('slide-1');
                };
                slideFeat.current.classList.remove('slide-2', 'slide-ani-2', 'slide-3', 'slide-ani-3', 'container', 'px-2', 'px-md-5');
                slideBtn.current.href = '/register';
                slideBtn.current.style.display = 'inline-block';
                slideBtn.current.innerHTML = images[slideCounter + 1].button;
                handleClass(slideCounter + 1);
                slideIdx(slideCounter + 1);
                slideCounter++;
                animateSlide(slideImage);
                break;
            case 1:
                if (!slides.includes('slide2')) {
                    slideFeat.current.classList.add('slide-2', 'slide-ani-2', 'container', 'px-2', 'px-md-5');
                    slides.push('slide2');
                } else {
                    slideFeat.current.classList.add('slide-2', 'container', 'px-2', 'px-md-5');
                };
                slideFeat.current.classList.remove('slide-1', 'slide-ani-1', 'slide-3', 'slide-ani-3');
                slideBtn.current.style.display = 'none';
                handleClass(slideCounter + 1);
                slideIdx(slideCounter + 1);
                slideCounter++;
                animateSlide(slideImage);
                break;
            case 2:
                if (!slides.includes('slide3')) {
                    slideFeat.current.classList.add('slide-3', 'slide-ani-3', 'container', 'px-2', 'px-md-5');
                    slides.push('slide3');
                } else {
                    slideFeat.current.classList.add('slide-3', 'container', 'px-2', 'px-md-5');
                };
                slideFeat.current.classList.remove('slide-1', 'slide-ani-1', 'slide-2', 'slide-ani-2');
                slideBtn.current.style.display = 'inline-block';
                slideBtn.current.innerHTML = images[slideCounter + 1].button;
                handleClass(slideCounter + 1);
                slideIdx(slideCounter + 1);
                slideCounter++;
                animateSlide(slideImage);
                break;
            default:
                slideFeat.current.classList.remove('container', 'px-2', 'px-md-5');
                slideBtn.current.style.display = 'inline-block';
                slideBtn.current.innerHTML = images[slideCounter + 1].button;
                handleClass(slideCounter + 1);
                slideIdx(slideCounter + 1);
                slideCounter++;
                animateSlide(slideImage);
                break;
        }
        // if (slideCounter + 1 === 1) {
        //     slideBtn.current.style.display = 'none';
        // } else {
        //     slideBtn.current.style.display = 'inline-block';
        //     slideBtn.current.innerHTML = images[slideCounter + 1].button;
        // }
        // handleClass(slideCounter + 1);
        // slideIdx(slideCounter + 1);
        // slideCounter++;
        // animateSlide(slideImage);
    }

    return {goToPreviousSlide, goToNextSlide, goToSlide, slideCounter};
}

/* ********************************************************* EXPORT ********************************************************* */
export default useSlider;