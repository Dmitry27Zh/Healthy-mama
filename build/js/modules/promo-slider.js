'use strict';

(function () {
  const sliderElement = document.querySelector('.promo__slider');
  const slidesContainer = sliderElement.querySelector('.promo__slider-list');
  const buttonPrevElement = sliderElement.querySelector('.promo__slider-button--prev');
  const buttonNextElement = sliderElement.querySelector('.promo__slider-button--next');
  const radioButtonElements = sliderElement.querySelectorAll('[type="radio"][id^="promo"]');
  const radioButtonActiveElement = sliderElement.querySelector('[type="radio"][id^="promo"][checked]');

  const tabletMinBreakpoint = window.const.Breakpoints.TABLET[0];
  const MoveLengthToBreakpoints = {
    DESKTOP: null,
    TABLET: null,
    MOBILE: 100,
  };
  let isRadioButtonsActive = true;

  const switchRadioButtons = (mode) => {
    for (let radioButtonElement of radioButtonElements) {
      radioButtonElement.disabled = mode;
      if (radioButtonElement === radioButtonActiveElement) {
        radioButtonActiveElement.checked = !mode;
      }
    }
  };

  const enableSwitchOfRadioButtons = () => {
    if (document.documentElement.clientWidth < tabletMinBreakpoint && isRadioButtonsActive) {
      switchRadioButtons(true);
      isRadioButtonsActive = false;
    }

    if (document.documentElement.clientWidth >= tabletMinBreakpoint && !isRadioButtonsActive) {
      switchRadioButtons(false);
      isRadioButtonsActive = true;
    }
  };

  enableSwitchOfRadioButtons();

  window.addEventListener('resize', () => {
    enableSwitchOfRadioButtons();
  });

  const initSlider = window.slider(sliderElement, slidesContainer, buttonPrevElement, buttonNextElement, MoveLengthToBreakpoints);
  initSlider();
})();
