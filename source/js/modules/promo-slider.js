'use strict';

(function () {
  const sliderElement = document.querySelector('.promo__slider');
  const slidesContainer = sliderElement.querySelector('.promo__slider-list');
  const buttonPrevElement = sliderElement.querySelector('.promo__slider-button--prev');
  const buttonNextElement = sliderElement.querySelector('.promo__slider-button--next');
  const MoveLengthToBreakpoints = {
    DESKTOP: 0,
    TABLET: 0,
    MOBILE: 100,
  };

  const initSlider = window.slider(sliderElement, slidesContainer, buttonPrevElement, buttonNextElement, MoveLengthToBreakpoints);
  initSlider();
})();
