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

    Factory.prototype.onModalHide = function() {
        if (this.instance.variables.saving === false) {
            var undo = this.instance.undoRedoStack.undoCommand;

            // One execution will only move 1 step back in history
            // we need to move back till the start of history
            while(undo.enabled()) {
                undo.execute();
            }
        }
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
    }

    namespace.Factory = Factory;
})(KnockoutBootstrapModal);