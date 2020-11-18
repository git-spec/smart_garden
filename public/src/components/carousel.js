import React, { useState, Component, useEffect } from 'react';
import fotos2 from '../data/fotos2'

import {
  Carousel,
  CarouselItem,
  CarouselControl,
  CarouselIndicators,
  CarouselCaption
} from 'reactstrap';

const Example = (props) => {
  const [activeIndex, setActiveIndex] = useState(props.id);
  const [animating, setAnimating] = useState(false);

  const scrollTop = () => {
    window.scrollTo(0, 0);
  };

  useEffect(() => {
      window.scrollTop(0, 0);
  },[activeIndex])

  const next = () => {
    if (animating) return;
    const nextIndex = activeIndex === fotos2.length - 1 ? 0 : activeIndex + 1 || 
    setActiveIndex(nextIndex);
    scrollTop();
  }

  const previous = () => {
    if (animating) return;
    const nextIndex = activeIndex === 0 ? fotos2.length - 1 : activeIndex - 1;
    setActiveIndex(nextIndex);
    scrollTop();
  }

  const goToIndex = (newIndex) => {
    if (animating) return;
    setActiveIndex(newIndex);
  }

  const slides = fotos2.map((item) => {


    return (
      <CarouselItem data-pause="hover" style={{ minHeight: '20em' }}
        className="custom-tag"
        tag="div"
        key={item.url}
        onExiting={() => setAnimating(true)}
        onExited={() => setAnimating(false)}
      >
        {/* <img src={props.foto} alt={item.altText}/> */}
        <img className="imagenCarousel" src={item.url} alt={item.altText} />

        <CarouselCaption className="text-danger" captionText={item.caption} captionHeader={item.caption} />

      </CarouselItem>


    );
  });

  return (
    <div>

      {/* interval={false} para el slider */}
      <Carousel
        activeIndex={activeIndex}
        next={next}
        previous={previous}
        interval={false}
      >

        <CarouselIndicators items={fotos2} activeIndex={activeIndex} onClickHandler={goToIndex} />
        {slides}
        <CarouselControl direction="prev" directionText="Previous" onClickHandler={previous} />
        <CarouselControl direction="next" directionText="Next" onClickHandler={next} />
      </Carousel>
    </div>
  );
}

export default Example;