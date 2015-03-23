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
        this.variables = {};
        reset.call(this);

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
        // templateIsExternal has to be before template, so when 
        // resetting, template's subscriber will pick up the new 
        // templateIsExternal value as well.
        templateIsExternal: false,
        template: "<div></div>",
        templateVariables: {
            closeButton: true,
            closeCross: true,
            footer: true,
            header: true,
            large: false,
            saveButton: true,
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
        // Used so the viewmodel is not reverted back when users click
        // the save button.
        this.variables.saving = true;

        var promise = this.factory.createHidingPromise();

        // If there is specified a save callback, send a hide promise
        // so the modal can be hidden if a certain logic passes
        if (isFunction(this.variables.callbacks.save)) {
            this.variables.callbacks.save.call(this, promise, this.variables.viewmodel);
        // If no save callback is specified, proceed with hiding the
        // modal
        } else {
            promise.resolve(true);
        }

        this.variables.saving = false;

        return true;
    }

    var reset = function() {
        var variables = $.extend({}, Modal.VARIABLE_DEFAULTS, {
            closeClick: closeClick.bind(this), 
            saveClick: saveClick.bind(this)
        });
        mapping.fromJS(variables, {
            copy: ["saving", "templateIsExternal"]
        }, this.variables);
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

    Modal.prototype.large = function(large) {
        if (typeof large === "undefined") {
            large = true;
        }
        this.variables.templateVariables.large(large);
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

    namespace.Modal = function() {
        if (namespace.Modal.prototype._singletonInstance) {
            reset.call(namespace.Modal.prototype._singletonInstance);
            return namespace.Modal.prototype._singletonInstance;
        }

        var instance = new Modal;
        namespace.Modal.prototype._singletonInstance = instance;

        return instance;
    };
})(KnockoutBootstrapModal);