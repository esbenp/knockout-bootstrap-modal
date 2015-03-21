(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['knockout', 'bootstrap'], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory(require('knockout'), require('bootstrap'));
  } else {
    root.KnockoutBootstrapModal = factory(root.ko, root.jQuery);
  }
}(this, function(ko, bootstrap) {
"use strict";

function KnockoutBootstrapModal() {
	
}
return KnockoutBootstrapModal;
}));
