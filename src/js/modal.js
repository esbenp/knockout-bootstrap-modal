/**
 * MODAL
 *
 * @param  {[type]} namespace [description]
 * @return {[type]}           [description]
 */
(function(namespace){
    "use strict";

    var Modal = function(modal, settings, callbacks) {
        this.container;
        this.settings = $.extend({}, Modal.DEFAULTS, settings || {});
        console.log(this.settings);
        this.variables = {};
        reset.call(this);

        $.extend(this.variables.callbacks, callbacks);

        this.factory = new namespace.Factory(this, modal);
    }

    Modal.DEFAULTS = {
        "appendContainerTo": "body",
        "body": ".modal-body"
    };

    Modal.VARIABLE_DEFAULTS = {
        callbacks: {

        },
        closeClick: null,
        saveClick: null,
        saving: false,
        promptExternalTemplate: false,
        promptInputTemplate: "<input type='text' data-bind='value: prompt'>",
        promptTextTemplate: "<p data-bind='text: text'></p>",
        // templateIsExternal has to be before template, so when
        // resetting, template's subscriber will pick up the new
        // templateIsExternal value as well.
        templateIsExternal: false,
        template: "<div></div>",
        templateVariables: {
            closeButton: true,
            closeButtonLabel: "Cancel",
            closeCross: true,
            footer: true,
            header: true,
            large: false,
            saveButton: true,
            saveButtonLabel: "Save changes",
            title: false
        },
        viewmodel: {}
    };

    var closeClick = function(context, e) {
        var self = this;

        fireIfFunction(this.variables.callbacks.close);
        this.hide();

        return true;
    }

    var saveClick = function(context, e) {
        var self = this;
        // Used so the viewmodel is not reverted back when users click
        // the save button.
        this.variables.saving = true;

        var promise = this.factory.createHidingPromise();

        $.when(promise).then(function(){
            self.variables.saving = false;
        });

        // If there is specified a save callback, send a hide promise
        // so the modal can be hidden if a certain logic passes
        if (isFunction(this.variables.callbacks.save)) {
            this.variables.callbacks.save.call(this, promise, this.variables.viewmodel);
        // If no save callback is specified, proceed with hiding the
        // modal
        } else {
            promise.resolve(true);
        }

        return true;
    }

    var reset = function() {
        var variables = $.extend({}, Modal.VARIABLE_DEFAULTS, {
            closeClick: closeClick.bind(this),
            saveClick: saveClick.bind(this)
        });
        mapping.fromJS(variables, {
            copy: [
                    "promptExternalTemplate",
                    "promptInputTemplate",
                    "promptTextTemplate",
                    "saving",
                    "templateIsExternal"
                ]
        }, this.variables);
    }

    Modal.prototype.alert = function alert() {
        this.header(false);
        this.closeButton(false);
        this.saveButtonLabel("Ok");
        return this;
    }

    Modal.prototype.close = function(closeFunction) {
        this.variables.callbacks.close = closeFunction;
        return this;
    }

    Modal.prototype.closeButton = function(closeButton) {
        this.variables.templateVariables.closeButton(closeButton);
        return this;
    };

    Modal.prototype.closeButtonLabel = function(closeButtonLabel) {
        this.variables.templateVariables.closeButtonLabel(closeButtonLabel);
        return this;
    }

    Modal.prototype.closeCross = function(closeCross) {
        this.variables.templateVariables.closeCross(closeCross);
        return this;
    };

    Modal.prototype.confirm = function confirm(text) {
        this.viewmodel({
            text: text
        });
        this.template("<p data-bind='text: text'></p>");
        this.header(false);
        this.closeButtonLabel('No');
        this.saveButtonLabel('Yes');
        return this;
    }

    Modal.prototype.footer = function footer(footer) {
        this.variables.templateVariables.footer(footer);
        return this;
    }

    Modal.prototype.header = function header(header) {
        this.variables.templateVariables.header(header);
        return this;
    }

    Modal.prototype.hide = function() {
        this.container.modal("hide");
        return this;
    };

    Modal.prototype.large = function(large) {
        if (typeof large === "undefined") {
            large = true;
        }
        this.variables.templateVariables.large(large);
        return this;
    }

    Modal.prototype.prompt = function prompt(observable, text) {
        this.viewmodel({
            prompt: observable,
            text: text
        });
        this.header(false);
        this.saveButtonLabel("Ok");

        if (this.variables.promptExternalTemplate === false) {
            var template = "";
            if (text !== undefined) {
                template += this.variables.promptTextTemplate;
            }
            template += this.variables.promptInputTemplate;

            this.template(template, false);
        } else {
            this.template(this.variables.promptExternalTemplate, true);
        }

        return this;
    }

    Modal.prototype.show = function() {
        var self = this;

        // Knockout bindings cannot be applied until the subview has been
        // inserted. Otherwise, component elements are not going to be
        // rendered
        $.when(this.templatePromise).then(function(){
            // Have to clean node before, as to not reapply bindings
            ko.cleanNode(self.container[0]);
            // Has to be done here, as cleanNode will remove events
            self.factory.setupEvents();
            ko.applyBindings(self.variables, self.container[0]);
            self.container.modal("show");
        });

        return this;
    };

    Modal.prototype.setDefaultOption = function setDefaultOption(key, value) {
        Modal.VARIABLE_DEFAULTS[key] = value;
        return this;
    }

    Modal.prototype.save = function(saveFunction) {
        this.variables.callbacks.save = saveFunction;
        return this;
    };

    Modal.prototype.saveButton = function(saveButton) {
        this.variables.templateVariables.saveButton(saveButton);
        return this;
    }

    Modal.prototype.saveButtonLabel = function(saveButtonLabel) {
        this.variables.templateVariables.saveButtonLabel(saveButtonLabel);
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
        this.undoRedoStack = undomanager(this.variables.viewmodel);
        return this;
    };

    namespace.Modal = function(replace) {
        if (replace === false) {
            return new Modal(undefined, {}, {
                hidden: function(container) {
                    container.remove();
                }
            });
        }

        if (namespace.Modal.prototype._singletonInstance) {
            reset.call(namespace.Modal.prototype._singletonInstance);
            return namespace.Modal.prototype._singletonInstance;
        }

        var instance = new Modal;
        namespace.Modal.prototype._singletonInstance = instance;

        return instance;
    };

    namespace.Modal.prototype.setDefaultOption = function setDefaultOption(key, value) {
        Modal.VARIABLE_DEFAULTS[key] = value;
    }

    namespace.Modal.prototype.extendDefaultOptions = function extendDefaultOptions(options)
    {
        $.extend(true, Modal.VARIABLE_DEFAULTS, options);
    }
})(KnockoutBootstrapModal);
