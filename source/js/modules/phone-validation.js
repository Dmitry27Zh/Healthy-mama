'use strict';

(function () {
  const createMask = window.IMask;
  const inputPhone = document.getElementById('phone');

  if (inputPhone) {
    createMask(inputPhone, {mask: '+{7} (000) 000-00-00'});
  }
})();
