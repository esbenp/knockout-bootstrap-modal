(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['jquery', 'knockout', 'bootstrap', 'text!knockout-bootstrap-modal-html', 'require', 'knockout-undomanager'], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory(require('jquery'), require('knockout'), require('bootstrap'), require('text!knockout-bootstrap-modal-html'), require('require'), require('knockout-undomanager'));
  } else {
    root.KnockoutBootstrapModal = factory(root.jQuery, root.ko, root.jQuery, root.KnockoutBootstrapModalHtml, root.jQuery, root.knockoutUndoManager);
  }
}(this, function($, ko, bootstrap, html, require, undomanager) {
if (typeof KnockoutBootstrapModal === "undefined") { var KnockoutBootstrapModal = {}; }

/**
 * FACTORY
 * 
 * @param  {[type]} namespace [description]
 * @param  {[type]} markup    [description]
 * @return {[type]}           [description]
 */
(function(namespace, markup){
    "use strict";

    var Factory = function(instance, container) {
        this.instance = instance;
        this.initialize(container);
        this.initializeModal();

        var template = new namespace.Template(this.instance);
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

    Factory.prototype.setContainer = function(container) {
        var container = this.evaluateContainerInput(container);

        if (container.length === 0) {
            throw Error("Knockout-bootstrap-modal: Could not find container with selector " + container);
        }

        this.instance.container = container;

        return container;
    };

    namespace.Factory = Factory;
})(KnockoutBootstrapModal, html);

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
        this.undoRedoStack.undoCommand.execute();
        fireIfFunction(this.variables.callbacks.close);
        this.hide();

        return true;
    }

    var saveClick = function(context, e) {
        this.hide();
        fireIfFunction(this.variables.callbacks.save);

        return true;
    }

    Modal.prototype.close = function(closeFunction) {
        this.variables.callbacks.close = closeFunction;
        return this;
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
        var self = this;

        $.when(this.templatePromise).then(function(){
            ko.applyBindings(self.variables, self.container[0]);
            self.container.modal("show");
        });
        
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
        this.undoRedoStack = undomanager(this.variables.viewmodel);
        return this;
    };

    namespace.Modal = function() { return new Modal; };
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
        var templateContent = $(templateContent);

        modalBody.html("");
        templateContent.appendTo(modalBody);
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
        return $(input, context);
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
    var args = Array.prototype.slice.call(arguments);

    // remove the function
    args.shift();

    if (typeof func === "function") {
        return func.apply(this, args);
    }

    return false;
}
return KnockoutBootstrapModal.Modal;
}));
