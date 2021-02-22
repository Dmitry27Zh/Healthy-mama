'use strict';

(function () {
  const TRANSITION_DURATION = '1s';
  const UPDATE_TIMEOUT = 1000;

  const SliderMode = {
    PREV: 'prev',
    NEXT: 'next',
  };

  const Breakpoints = window.const.Breakpoints;

  window.slider = (sliderElement, slidesContainer, prevButton, nextButton, moveLengthList) => {
    let moveLength = null;
    let translateValue = 0;

    function getMoveLength() {
      const sliderWidth = sliderElement.offsetWidth;
      for (let breakpoint in Breakpoints) {
        if (window.common.isInRange(Breakpoints[breakpoint], sliderWidth)) {
          moveLength = sliderWidth * moveLengthList[breakpoint] / 100;
          break;
        }
      }
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
          const lastSlide = slidesContainer.children[slidesContainer.children.length - 1];
          slidesContainer.prepend(lastSlide.cloneNode(true));
          lastSlide.remove();
          resetTranslate(mode);
          break;
        case SliderMode.NEXT:
          const firstSlide = slidesContainer.children[0];
          slidesContainer.append(firstSlide.cloneNode(true));
          firstSlide.remove();
          resetTranslate(mode);
          break;
      }
    }

    function addExtraSlides() {
      const slides = [...slidesContainer.children];
      const slidesHalfQuantity = Math.floor(slides.length / 2);
      slides.slice(slidesHalfQuantity).reverse().forEach((slide) => {
        const slideCopy = slide.cloneNode(true);
        slideCopy.classList.remove('products__slide--active');
        slidesContainer.prepend(slideCopy);
        resetTranslate(SliderMode.PREV);
      });
      slides.slice(0, slidesHalfQuantity).forEach((slide) => {
        const slideCopy = slide.cloneNode(true);
        slideCopy.classList.remove('products__slide--active');
        slidesContainer.append(slideCopy);
      });
    }

    let activeSlideElement = [...slidesContainer.children].find((slideElement) => slideElement.classList.contains('products__slide--active'));


    function toggleActiveClass(mode) {
      let activeSlideIndex = [...slidesContainer.children].indexOf(activeSlideElement);
      activeSlideElement.classList.remove('products__slide--active');
      switch (mode) {
        case SliderMode.PREV:
          activeSlideElement = slidesContainer.children[--activeSlideIndex];
          break;
        case SliderMode.NEXT:
          activeSlideElement = slidesContainer.children[++activeSlideIndex];
          break;
      }
      activeSlideElement.classList.add('products__slide--active');
    }

    let slideInterval = null;

    function toggleSlide(mode) {
      switch (mode) {
        case SliderMode.PREV:
          if (slideInterval) {
            return;
          }

          toggleActiveClass(mode);
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

          toggleActiveClass(mode);
          setTranslate(mode);

          slideInterval = window.setTimeout(() => {
            restoreSlide(mode);
            slideInterval = null;
          }, UPDATE_TIMEOUT);

          break;
      }
    }

    return function () {
      getMoveLength();

      addExtraSlides();

      prevButton.addEventListener('click', () => {
        toggleSlide(SliderMode.PREV);
      });

      nextButton.addEventListener('click', () => {
        toggleSlide(SliderMode.NEXT);
      });
    };
  };
})();
