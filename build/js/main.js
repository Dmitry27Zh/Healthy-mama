/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__(1);
	__webpack_require__(2);
	__webpack_require__(3);
	__webpack_require__(4);
	__webpack_require__(5);
	__webpack_require__(6);
	__webpack_require__(7);
	module.exports = __webpack_require__(8);


/***/ }),
/* 1 */
/***/ (function(module, exports) {

	'use strict';

	(function () {
	  const isInRange = ([min, max = Infinity], number) => {
	    return number >= min && number < max;
	  };

	  const offRadioButtons = (element) => {
	    const radioButtons = element.querySelectorAll('[type="radio"]');
	    for (let radioButton of radioButtons) {
	      radioButton.checked = false;
	    }
	  };

	  window.common = {
	    isInRange,
	    offRadioButtons,
	  };
	})();


/***/ }),
/* 2 */
/***/ (function(module, exports) {

	'use strict';

	(function () {
	  window.const = {
	    Breakpoints: {
	      MOBILE: [320, 768],
	      TABLET: [768, 1024],
	      DESKTOP: [1024],
	    }
	  };
	})();


/***/ }),
/* 3 */
/***/ (function(module, exports) {

	'use strict';

	(function () {
	  const TRANSITION_DURATION = '1s';
	  const UPDATE_TIMEOUT = 1000;

	  const SliderMode = {
	    PREV: 'prev',
	    NEXT: 'next',
	  };

	  const Breakpoints = window.const.Breakpoints;

	  window.slider = (sliderElement, slidesContainer, prevButton, nextButton, moveLengthList, activeSlideClassName) => {
	    let moveLength = null;
	    let translateValue = 0;
	    let initializated = false;

	    function getMoveLength() {
	      const currentBreakPoint = Object.keys(Breakpoints).find((breakpoint) => window.common.isInRange(Breakpoints[breakpoint], document.documentElement.clientWidth));
	      return moveLengthList[currentBreakPoint];
	    }

	    function setMoveLength() {
	      const moveLengthPerc = getMoveLength();
	      const sliderWidth = sliderElement.offsetWidth;
	      moveLength = sliderWidth * moveLengthPerc / 100;

	    }

	    function setTranslate(mode) {
	      switch (mode) {
	        case SliderMode.PREV:
	          translateValue += moveLength;
	          break;
	        case SliderMode.NEXT:
	          translateValue -= moveLength;
	          break;
	      }
	      slidesContainer.style.transitionDuration = TRANSITION_DURATION;
	      slidesContainer.style.transform = `translateX(${translateValue}px)`;
	    }

	    function resetTranslate(mode) {
	      slidesContainer.style.transitionDuration = '0s';

	      switch (mode) {
	        case SliderMode.PREV:
	          translateValue -= moveLength;
	          break;
	        case SliderMode.NEXT:
	          translateValue += moveLength;
	          break;
	      }

	      slidesContainer.style.transform = `translateX(${translateValue}px)`;
	    }

	    function restoreSlide(mode) {
	      switch (mode) {
	        case SliderMode.PREV:
	          const lastSlide = [...slidesContainer.children].pop();
	          slidesContainer.prepend(lastSlide);
	          resetTranslate(mode);
	          break;
	        case SliderMode.NEXT:
	          const firstSlide = [...slidesContainer.children].shift();
	          slidesContainer.append(firstSlide);
	          resetTranslate(mode);
	          break;
	      }
	    }

	    function addExtraSlides() {
	      const slides = [...slidesContainer.children];
	      const slidesHalfQuantity = Math.floor(slides.length / 2);
	      slides.slice(slidesHalfQuantity).reverse().forEach((slide) => {
	        const slideCopy = slide.cloneNode(true);
	        slideCopy.classList.add('js-copy');
	        slideCopy.classList.remove(activeSlideClassName);
	        slidesContainer.prepend(slideCopy);
	        resetTranslate(SliderMode.PREV);
	      });
	      slides.slice(0, slidesHalfQuantity).forEach((slide) => {
	        const slideCopy = slide.cloneNode(true);
	        slideCopy.classList.add('js-copy');
	        slideCopy.classList.remove(activeSlideClassName);
	        slidesContainer.append(slideCopy);
	      });
	    }

	    let activeSlideElement = [...slidesContainer.children].find((slideElement) => slideElement.classList.contains('products__slide--active'));


	    function toggleActiveClass(mode) {
	      let activeSlideIndex = [...slidesContainer.children].indexOf(activeSlideElement);
	      activeSlideElement.classList.remove(activeSlideClassName);
	      switch (mode) {
	        case SliderMode.PREV:
	          activeSlideElement = slidesContainer.children[--activeSlideIndex];
	          break;
	        case SliderMode.NEXT:
	          activeSlideElement = slidesContainer.children[++activeSlideIndex];
	          break;
	      }
	      activeSlideElement.classList.add(activeSlideClassName);
	    }

	    let slideInterval = null;

	    function toggleSlide(mode) {
	      switch (mode) {
	        case SliderMode.PREV:
	          if (slideInterval) {
	            return;
	          }

	          if (activeSlideClassName) {
	            toggleActiveClass(mode);
	          }
	          setTranslate(mode);

	          slideInterval = window.setTimeout(() => {
	            restoreSlide(mode);
	            slideInterval = null;
	          }, UPDATE_TIMEOUT);

	          break;
	        case SliderMode.NEXT:
	          if (slideInterval) {
	            return;
	          }

	          if (activeSlideClassName) {
	            toggleActiveClass(mode);
	          }
	          setTranslate(mode);

	          slideInterval = window.setTimeout(() => {
	            restoreSlide(mode);
	            slideInterval = null;
	          }, UPDATE_TIMEOUT);

	          break;
	      }
	    }

	    function updateSlider() {
	      const lastMoveLength = moveLength;
	      setMoveLength();
	      if (lastMoveLength !== moveLength) {
	        const translateValueProportion = translateValue / lastMoveLength;
	        translateValue = translateValueProportion * moveLength;
	        slidesContainer.style.transform = `translateX(${translateValue}px)`;
	      }
	    }

	    function removeSlider() {
	      moveLength = null;
	      translateValue = 0;
	      [...slidesContainer.children].filter((slide) => slide.classList.contains('js-copy')).forEach((slide) => slide.remove());
	      slidesContainer.style.transitionDuration = '';
	      slidesContainer.style.transform = '';
	      initializated = false;
	    }

	    function init() {
	      setMoveLength();

	      addExtraSlides();

	      prevButton.addEventListener('click', () => {
	        toggleSlide(SliderMode.PREV);
	      });

	      nextButton.addEventListener('click', () => {
	        toggleSlide(SliderMode.NEXT);
	      });
	      initializated = true;
	    }

	    function touchStartHandler(startEvt) {
	      const startCoordX = startEvt.touches[0].clientX;
	      let newCoordX = null;

	      function touchMoveHandler(moveEvt) {
	        newCoordX = moveEvt.touches[0].clientX;
	      }

	      sliderElement.addEventListener('touchmove', touchMoveHandler);
	      sliderElement.addEventListener('touchend', touchEndHandler);

	      function touchEndHandler() {
	        const moveX = newCoordX - startCoordX;
	        if (moveX > 0) {
	          toggleSlide(SliderMode.PREV);
	        }
	        if (moveX < 0) {
	          toggleSlide(SliderMode.NEXT);
	        }
	        sliderElement.removeEventListener('touchmove', touchMoveHandler);
	        sliderElement.removeEventListener('touchend', touchEndHandler);
	      }
	    }

	    return function () {
	      if (!initializated && getMoveLength()) {
	        init();
	      }

	      window.addEventListener('resize', () => {
	        const updatedMoveLength = getMoveLength();
	        if (initializated) {
	          if (updatedMoveLength) {
	            updateSlider();
	          } else {
	            removeSlider();
	          }
	        } else if (updatedMoveLength) {
	          init();
	        }
	      });

	      sliderElement.addEventListener('touchstart', touchStartHandler);
	    };
	  };
	})();


/***/ }),
/* 4 */
/***/ (function(module, exports) {

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


/***/ }),
/* 5 */
/***/ (function(module, exports) {

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


/***/ }),
/* 6 */
/***/ (function(module, exports) {

	'use strict';

	(function () {
	  const MOBILE_WIDTH_MAX = window.const.Breakpoints.MOBILE[1];

	  const headerElement = document.querySelector('.header');
	  const headerWrapperElement = headerElement.querySelector('.header__wrapper');
	  const menuToggleElement = headerWrapperElement.querySelector('.header__toggle');
	  const mainNavElement = headerElement.querySelector('.main-nav');
	  const mainElement = document.querySelector('main');
	  const footerElement = document.querySelector('.footer');
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
	    if (footerElement) {
	      footerElement.classList.toggle('inactive');
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


/***/ }),
/* 7 */
/***/ (function(module, exports) {

	'use strict';

	(function () {
	  const createMask = window.IMask;
	  const inputPhone = document.getElementById('phone');

	  if (inputPhone) {
	    createMask(inputPhone, {mask: '+{7} (000) 000-00-00'});
	  }
	})();


/***/ }),
/* 8 */
/***/ (function(module, exports) {

	'use strict';

	(function () {
	  window.checkWebpSupport();
	})();


/***/ })
/******/ ]);