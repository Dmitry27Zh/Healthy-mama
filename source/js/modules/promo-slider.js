'use strict';

(function () {
  const sliderElement = document.querySelector('.promo__slider');
  const slidesContainer = sliderElement.querySelector('.promo__slider-list');
  const buttonPrevElement = sliderElement.querySelector('.promo__slider-button--prev');
  const buttonNextElement = sliderElement.querySelector('.promo__slider-button--next');
  const MoveLengthToBreakpoints = {
    DESKTOP: null,
    TABLET: null,
    MOBILE: 100,
  };

  const switchRadioButtons = (mode) => {
    const radioButtonElements = sliderElement.querySelectorAll('[type="radio"][id^="promo"]');
    for (let radioButtonElement of radioButtonElements) {
      radioButtonElement.disabled = mode;

    }
  };

  const enableSwitchOfRadioButtons = () => {
    if (document.documentElement.clientWidth < 768) {
      switchRadioButtons(true);
    } else {
      switchRadioButtons(false);
    }
  };

  enableSwitchOfRadioButtons();

  window.addEventListener('resize', () => {
    enableSwitchOfRadioButtons();
  });

  const initSlider = window.slider(sliderElement, slidesContainer, buttonPrevElement, buttonNextElement, MoveLengthToBreakpoints);
  initSlider();
})();
