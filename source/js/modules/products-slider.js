'use strict';

(function () {
  const sliderElement = document.querySelector('.products__slider');
  const slidesContainer = sliderElement.querySelector('.products__slider-list');
  const buttonPrevElement = sliderElement.querySelector('.products__button--prev');
  const buttonNextElement = sliderElement.querySelector('.products__button--next');

  const MoveLengthToBreakpoints = {
    DESKTOP: 35.46,
    TABLET: 88.66,
    MOBILE: 85.15,
  };

  const initSlider = window.slider(sliderElement, slidesContainer, buttonPrevElement, buttonNextElement, MoveLengthToBreakpoints, 'products__slide--active');
  initSlider();
})();
