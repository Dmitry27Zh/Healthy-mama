'use strict';

(function () {
  const TRANSITION_DURATION = '1s';
  const UPDATE_TIMEOUT = 1000;
  const TOUCH_DELAY = 300;
  const MIN_SWIPE_LENGTH = 50;

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

    function swipeSlide(moveX) {
      if (moveX > 0) {
        toggleSlide(SliderMode.PREV);
      }
      if (moveX < 0) {
        toggleSlide(SliderMode.NEXT);
      }
    }

    function longTouchHandler(moveX) {
      slidesContainer.style.transform = `translateX(${translateValue}px)`;
      if (Math.abs(moveX) >= moveLength / 2) {
        swipeSlide(moveX);
      }
    }

    function touchStartHandler(startEvt) {
      const startCoord = {
        X: startEvt.touches[0].clientX,
        Y: startEvt.touches[0].clientY,
      };
      let move = {};
      let temporaryTranslateValue = translateValue;
      const startTime = new Date();
      let currentTime = null;

      function touchMoveHandler(moveEvt) {
        const newCoord = {
          X: moveEvt.touches[0].clientX,
          Y: moveEvt.touches[0].clientY,
        };
        move.X = newCoord.X - startCoord.X;
        move.Y = newCoord.Y - startCoord.Y;
        if (Math.abs(move.Y) > MIN_SWIPE_LENGTH) {
          return;
        }
        currentTime = new Date();
        if (currentTime - startTime >= TOUCH_DELAY) {
          slidesContainer.style.transform = `translateX(${temporaryTranslateValue + move.X}px)`;
        }
      }

      sliderElement.addEventListener('touchmove', touchMoveHandler);
      sliderElement.addEventListener('touchend', touchEndHandler);

      function touchEndHandler() {
        sliderElement.removeEventListener('touchmove', touchMoveHandler);
        sliderElement.removeEventListener('touchend', touchEndHandler);
        if (Math.abs(move.Y) > MIN_SWIPE_LENGTH) {
          slidesContainer.style.transform = `translateX(${translateValue}px)`;
          return;
        }
        if (currentTime - startTime < TOUCH_DELAY && Math.abs(move.X) >= MIN_SWIPE_LENGTH) {
          swipeSlide(move.X);
        } else {
          longTouchHandler(move.X);
        }
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
