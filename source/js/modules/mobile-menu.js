'use strict';

(function () {
  const MOBILE_WIDTH_MAX = window.const.Breakpoints.MOBILE[1];

  const headerElement = document.querySelector('.header');
  const headerWrapperElement = headerElement.querySelector('.header__wrapper');
  const menuToggleElement = headerWrapperElement.querySelector('.header__toggle');
  const mainNavElement = headerElement.querySelector('.main-nav');
  const mainElement = document.querySelector('main');
  let isToggleClickActive = false;

  const handleToggleClick = () => {
    if (headerElement) {
      headerElement.classList.toggle('header--menu');
    }
    if (headerWrapperElement) {
      headerWrapperElement.classList.toggle('header__wrapper--menu');
    }
    if (mainNavElement) {
      mainNavElement.classList.toggle('main-nav--opened');
    }
    if (mainElement) {
      mainElement.classList.toggle('inactive');
    }
  };

  const handleWindowResize = () => {
    if (window.innerWidth < MOBILE_WIDTH_MAX) {
      if (menuToggleElement && !isToggleClickActive) {
        menuToggleElement.addEventListener('click', handleToggleClick);
        isToggleClickActive = true;
      }
    } else if (isToggleClickActive) {
      menuToggleElement.removeEventListener('click', handleToggleClick);
      isToggleClickActive = false;
    }
  };

  handleWindowResize();

  window.addEventListener('resize', handleWindowResize);
})();
