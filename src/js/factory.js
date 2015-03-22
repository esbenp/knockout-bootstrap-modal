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