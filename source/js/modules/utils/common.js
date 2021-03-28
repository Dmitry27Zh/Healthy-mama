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
