'use strict';

(function () {
  window.checkWebpSupport = function (fn) {
    var html = document.documentElement,
        WebP = new Image();

    WebP.onload = WebP.onerror = function() {
        var isSupported = (WebP.height === 2);

        html.classList.toggle('webp', isSupported)
        html.classList.toggle('no-webp', !isSupported)
        if (fn) {
          fn(isSupported);
        }
    };
    WebP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
  }
})();
