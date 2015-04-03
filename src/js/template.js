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
        var templateElement = $(templateContent);

        if (templateElement.length === 0) {
            templateElement = $("<p/>").html(templateContent);
        }

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