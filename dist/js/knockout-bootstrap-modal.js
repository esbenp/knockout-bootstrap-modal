(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['jquery', 'knockout', 'bootstrap', 'text!knockout-bootstrap-modal-html', 'require', 'knockout-undomanager', 'knockout-mapping'], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory(require('jquery'), require('knockout'), require('bootstrap'), require('text!knockout-bootstrap-modal-html'), require('require'), require('knockout-undomanager'), require('knockout-mapping'));
  } else {
    root.KnockoutBootstrapModal = factory(root.jQuery, root.ko, root.jQuery, root.KnockoutBootstrapModalHtml, root.jQuery, root.knockoutUndoManager, root.ko['mapping']);
  }
}(this, function($, ko, bootstrap, html, require, undomanager, mapping) {
if (typeof KnockoutBootstrapModal === "undefined") { var KnockoutBootstrapModal = {}; }

/**
 * FACTORY
 *
 * @param  {[type]} namespace [description]
 * @return {[type]}           [description]
 */
(function(namespace){
    "use strict";

    var Factory = function(instance, container) {
        this.instance = instance;
        this.initialize(container);
        this.initializeModal();

        var template = new namespace.Template(this.instance);
    }

    Factory.prototype.createHidingPromise = function() {
        var self = this;
        var promise = $.Deferred();

        $.when(promise).then(function(){
            self.instance.hide();
        });

        return promise;
    }

    Factory.prototype.createContainerFromHtml = function(html) {
        var container = $(html);
        var appendTo  = $(this.instance.settings.appendContainerTo);

        if (appendTo.length === 0) {
            throw Error("Knockout-bootstrap-modal: Could not find an element with selector '" +
                        this.instance.settings.appendContainerTo + "' to append the modal container " +
                        "to.");
        }

        container.appendTo(appendTo);

        return container;
    };

    Factory.prototype.evaluateContainerInput = function(input) {
        return evaluateInputAsNodeElement(input);
    };

    Factory.prototype.initialize = function(container) {
        // No container was given in the constructor
        if (typeof container !== "undefined") {
            return this.setContainer(container);
        // Try create container from injected markup
        } else if(typeof html !== "undefined") {
            return this.setContainer(this.createContainerFromHtml(html));
        // No container was created
        } else {
            throw Error("Knockout-bootstrap-modal: No valid container was given.");
        }
    };

    Factory.prototype.initializeModal = function() {
        this.instance.container.modal({
            show: false
        });
    };

    Factory.prototype.onModalHide = function(e) {
        if (e.target !== this.instance.container[0]) {
            return false;
        }

        if (this.instance.variables.saving === false && this.instance.undoRedoStack !== undefined) {
            var undo = this.instance.undoRedoStack.undoCommand;

            // One execution will only move 1 step back in history
            // we need to move back till the start of history
            while(undo.enabled()) {
                undo.execute();
            }
        }
    }

    Factory.prototype.onModalHidden = function() {
        fireIfFunction(this.instance.variables.callbacks.hidden, this.instance.container);
    }

    Factory.prototype.setContainer = function(container) {
        var container = this.evaluateContainerInput(container);

        if (container.length === 0) {
            throw Error("Knockout-bootstrap-modal: Could not find container with selector " + container);
        }

        this.instance.container = container;

        return container;
    };

    Factory.prototype.setupEvents = function() {
        this.instance.container.on("hide.bs.modal", this.onModalHide.bind(this));
        this.instance.container.on("hidden.bs.modal", this.onModalHidden.bind(this));
    }

    namespace.Factory = Factory;
})(KnockoutBootstrapModal);


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
        alertExternalTemplate: false,
        alertTemplate: '<p data-bind=\'text: text\'></p>',
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
            closeButtonLabelPrompt: "Cancel",
            closeButtonLabelConfirm: "Cancel",
            closeCross: true,
            footer: true,
            header: true,
            large: false,
            saveButton: true,
            saveButtonLabel: "Save changes",
            saveButtonLabelAlert: "Ok",
            saveButtonLabelConfirm: "Confirm",
            saveButtonLabelPrompt: "Save changes",
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
        var variables = $.extend(true, {}, Modal.VARIABLE_DEFAULTS, {
            closeClick: closeClick.bind(this),
            saveClick: saveClick.bind(this)
        });

        mapping.fromJS(variables, {
            copy: [
                'alertTemplate',
                'alertExternalTemplate',
                'promptExternalTemplate',
                'promptInputTemplate',
                'promptTextTemplate',
                'saving',
                'templateIsExternal'
            ]
        }, this.variables);
    }

    Modal.prototype.alert = function alert(text) {
        this.viewmodel({
            text: text
        });
        this.template(this.variables.alertTemplate, this.variables.alertExternalTemplate);
        this.header(false);
        this.closeButton(false);
        this.saveButtonLabel(this.variables.templateVariables.saveButtonLabelAlert());
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
        this.alert(text);
        this.closeButton(true);
        this.closeButtonLabel(this.variables.templateVariables.closeButtonLabelConfirm());
        this.saveButtonLabel(this.variables.templateVariables.saveButtonLabelConfirm());
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
        this.closeButtonLabel(this.variables.templateVariables.closeButtonLabelPrompt());
        this.saveButtonLabel(this.variables.templateVariables.saveButtonLabelPrompt());

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


/**
 * FACTORY
 * 
 * @param  {[type]} namespace [description]
 * @param  {[type]} markup    [description]
 * @return {[type]}           [description]
 */
(function(namespace, require){
    "use strict"; 

    var Template = function(instance) {
        this.instance = instance;
        this.instance.templatePromise = this.setupTemplateContentPromise();
        
        this.setupTemplateListener(this.instance);
    }

    Template.prototype.insertTemplate = function(templateContent) {
        var modalBody = evaluateInputAsNodeElement(this.instance.settings.body, this.instance.container);
        var templateElement = $($.parseHTML(templateContent));

        modalBody.html("");
        templateElement.appendTo(modalBody);
    }

    Template.prototype.loadExternalUsingjQuery = function(template, promise) {
        var ajaxPromise = $.ajax({
            url: template
        });

        $.when(ajaxPromise).then(function(templateContent){
            promise.resolve(templateContent);
        });
    }

    Template.prototype.loadExternalUsingRequire = function(template, promise) {
        require(["text!"+template], function(templateContent) {
            promise.resolve(templateContent);
        });
    }

    Template.prototype.setupTemplateContentPromise = function() {
        var self = this;
        var promise = $.Deferred();

        $.when(promise).then(function(templateContent){
            self.insertTemplate(templateContent);
        });

        return promise;
    }

    Template.prototype.setupTemplateListener = function(instance) {
        var self = this;

        instance.variables.template.subscribe(function(newTemplate){
            var isExternal = instance.variables.templateIsExternal;
            self.instance.templatePromise = self.setupTemplateContentPromise();

            // Content should be externally loaded
            if (isExternal) {
                // Fallback for global variables
                if (require instanceof jQuery) {
                    self.loadExternalUsingjQuery(newTemplate, self.instance.templatePromise);
                // Require is available
                } else {
                    self.loadExternalUsingRequire(newTemplate, self.instance.templatePromise);
                }
            // The template passed was html
            } else {
                self.instance.templatePromise.resolve(newTemplate);
            }
        });
    }

    namespace.Template = Template;
})(KnockoutBootstrapModal, require);

var evaluateInputAsNodeElement = function(input, context, throwOnFail) {
    // Input is a javascript node
    if (input.nodeType) {
        return $(input);
    // Input is a jQuery instance
    } else if(input instanceof jQuery) {
        return input;
    // Fallback: input is a selector
    } else {
        var element = $(input, context);

        if (element.length === 0 && throwOnFail !== false) {
            throw Error("Knockout-bootstrap-modal: Could not find element with selector '" 
                        + input + "'");
        }

        return element;
    }
}

var fireIfFunction = function(){
    var func = arguments[0];

    if (!isFunction(func)) {
        return false;
    }

    var args = Array.prototype.slice.call(arguments);

    // remove the function
    args.shift();
    
    return func.apply(this, args);
}

var isFunction = function(input) {
    return input instanceof Function;
}
return KnockoutBootstrapModal.Modal;
}));
