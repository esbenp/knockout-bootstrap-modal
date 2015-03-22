/**
 * MODAL
 * 
 * @param  {[type]} namespace [description]
 * @return {[type]}           [description]
 */
(function(namespace){
    "use strict";

    var Modal = function(modal, settings) {
        this.container;
        this.settings = $.extend(Modal.DEFAULTS, settings || {});
        this.variables = {
            callbacks: {

            },
            closeClick: closeClick.bind(this),
            saveClick: saveClick.bind(this),
            template: ko.observable(""),
            templateIsExternal: false,
            templateVariables: {
                closeButton: ko.observable(true),
                closeCross: ko.observable(true),
                footer: ko.observable(true),
                header: ko.observable(true),
                saveButton: ko.observable(true),
                title: ko.observable(false)
            },
            viewmodel: {}
        };
     
        var factory = new namespace.Factory(this, modal);
    }

    Modal.DEFAULTS = {
        "appendContainerTo": "body",
        "body": ".modal-body"
    };

    var closeClick = function(context, e) {
        
        return true;
    }

    var saveClick = function(context, e) {
        
        return true;
    }

    Modal.prototype.closeButton = function(closeButton) {
        this.variables.templateVariables.closeButton(closeButton);
        return this;
    };

    Modal.prototype.closeCross = function(closeCross) {
        this.variables.templateVariables.closeCross(closeCross);
        return this;
    };

    Modal.prototype.hide = function() {
        this.container.modal("hide");
        return this;
    };

    Modal.prototype.show = function() {
        ko.applyBindings(this.variables, this.container[0]);

        this.container.modal("show");
        return this;
    };

    Modal.prototype.save = function(saveFunction) {
        this.variables.callbacks.save = saveFunction;
        return this;
    };

    Modal.prototype.saveButton = function(saveButton) {
        this.variables.templateVariables.saveButton(saveButton);
        return this;
    }

    Modal.prototype.title = function(title) {
        this.variables.templateVariables.title(title);
        return this;
    };

    Modal.prototype.template = function(input, external) {
        if (typeof external !== "undefined") {
            this.variables.templateIsExternal = external;
        }

        // Should be after the external variable, so the new 
        // external value is picked up by the template variables 
        // subscribers
        this.variables.template(input);

        return this;
    };

    Modal.prototype.viewmodel = function(viewmodel) {
        this.variables.viewmodel = viewmodel;
        return this;
    };

    namespace.Modal = function() { return new Modal; };
})(KnockoutBootstrapModal);