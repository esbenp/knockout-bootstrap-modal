(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['jquery', 'knockout', 'bootstrap', 'text!knockout-bootstrap-modal-html'], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory(require('jquery'), require('knockout'), require('bootstrap'), require('text!knockout-bootstrap-modal-html'));
  } else {
    root.KnockoutBootstrapModal = factory(root.jQuery, root.ko, root.jQuery, root.KnockoutBootstrapModalHtml);
  }
}(this, function($, ko, bootstrap, html) {
if (KnockoutBootstrapModal === undefined) { var KnockoutBootstrapModal = {}; }

(function(namespace, markup){
	"use strict";

	var Factory = function(instance, container) {
		this.instance = instance;

		this.initialize(container);
	}

	Factory.prototype.createContainerFromHtml = function(html) {
		var container = $(html);
		container.appendTo(this.instance.settings.appendContainerTo);
		return container;
	};

	Factory.prototype.evaluateContainerInput = function(input) {
		// Input is a javascript node
		if (input.nodeType) {
			return $(input);
		// Input is a jQuery instance
		} else if(input instanceof jQuery) {
			return input;
		// Fallback: input is a selector
		} else {
			return $(input);
		}
	};

	Factory.prototype.initialize = function(container) {
		// No container was given in the constructor
		if (typeof container !== "undefined") {
			this.setContainer(container);
		// Try create container from injected markup
		} else if(typeof html !== "undefined") {
			this.setContainer(this.createContainerFromHtml(html));
		// No container was created
		} else {
			throw Error("Knockout-bootstrap-modal: No valid container was given.");
		}
	};

	Factory.prototype.setContainer = function(container) {
		var container = this.evaluateContainerInput(container);

		if (container.length === 0) {
			throw Error("Knockout-bootstrap-modal: Could not find container with selector " + container);
		}

		this.instance.container = container;
	};

	namespace.Factory = Factory;
})(KnockoutBootstrapModal, html);
(function(namespace){
	"use strict";

	var Modal = function(modal, settings) {
		this.container;
		this.settings = $.extend(Modal.DEFAULTS, settings || {});
		this.variables = {
			callbacks: {

			},
			template: null,
			viewmodel: {}
		};
	 
		var factory = new namespace.Factory(this, modal);
	}

	Modal.DEFAULTS = {
		"appendContainerTo": "body"
	};

	Modal.prototype.hide = function() {
		this.container.modal("hide");
		return this;
	};

	Modal.prototype.show = function() {
		this.container.modal("show");
		return this;
	};

	Modal.prototype.save = function(saveFunction) {
		this.variables.callbacks.save = saveFunction;
		return this;
	};

	Modal.prototype.template = function(src) {
		this.variables.template = src;
		return this;
	};

	Modal.prototype.viewmodel = function(viewmodel) {
		this.variables.viewmodel = viewmodel;
		return this;
	};

	namespace.Modal = function() { return new Modal; };
})(KnockoutBootstrapModal);
return KnockoutBootstrapModal.Modal;
}));
