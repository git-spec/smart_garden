// import e from 'cors';
import {useEffect} from 'react';

const useSlider = (slideImage, slideTitle, slideText, slideClass, slideBtn, slideIdx, images) => {
    let slideCounter = 0;

    useEffect(() => startSlider());

    const startSlider =() => {
        slideImage.current.style.backgroundImage = `linear-gradient(
                                                    to right,
                                                    rgba(34, 34, 34, 0.4),
                                                    rgba(68, 68, 68, 0.4)
                                                    ), url(${images[0].src})`;
        slideTitle.current.innerHTML = images[0].title;
        slideText.current.innerHTML = images[0].text;
        slideBtn.current.innerHTML = images[0].button;
        handleClass(0);
        slideIdx(0);
    }

    const handleSlide = slide => {
        slideImage.current.style.backgroundImage = `url(${images[slide - 1].src})`;
        slideTitle.current.innerHTML = images[slide - 1].title;
        slideText.current.innerHTML = images[slide - 1].text;
        slideBtn.current.innerHTML = images[slide - 1].button;
        animateSlide(slideImage);
        handleClass(slide - 1);
        slideIdx(slide - 1);
    }
        
    const animateSlide = () => {
        slideImage.current.classList.add("fadeIn")
        setTimeout(() => {
            slideImage.current.classList.remove("fadeIn")
        }, 700);
    }

    const handleClass = idx => {
        slideClass.current.childNodes.forEach(item => item.classList.remove('shown'));
        slideClass.current.childNodes[idx].classList.add('shown');
    }
    
    const goToPreviousSlide = () => {
        if (slideCounter === 0) {
            handleSlide(images.length);
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
        slideBtn.current.innerHTML = images[slide].button;
        slideCounter = slide;
        animateSlide(slideImage);
        handleClass(slide);
        slideIdx(slide);
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
        slideBtn.current.innerHTML = images[slideCounter + 1].button;
        handleClass(slideCounter + 1);
        slideIdx(slideCounter + 1);
        slideCounter++;
        animateSlide(slideImage);
    }
    
    return {goToPreviousSlide, goToNextSlide, goToSlide};
}
  
export default useSlider;