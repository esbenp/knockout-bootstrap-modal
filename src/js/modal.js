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