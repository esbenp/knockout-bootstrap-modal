requirejs.config({
    baseUrl: '../bower_components',
    paths: {
        assets: "../examples/assets",
        dist: "../dist",

        bootstrap: "bootstrap/dist/js/bootstrap",
        jquery: "jquery/dist/jquery",
        knockout: "knockout/dist/knockout",
        "knockout-mapping": "bower-knockout-mapping/dist/knockout.mapping",
        "knockout-reactor": "knockoutjs-reactor-bower/knockout.reactor-beta",
        "knockout-undomanager": "knockout-undomanager-bower/knockout-undomanager-0.2",
        text: "requirejs-text/text",

        "knockout-bootstrap-modal-html": "../dist/html/modal.html",
        "knockout-selectize": "knockout-selectize/src/js/knockout-selectize",
        "knockout-selectize-html": "knockout-selectize/src/html",
        microplugin: "microplugin/src/microplugin",
        "selectable-placeholder": "knockout-selectize/plugins/selectablePlaceholder",
        selectize: "selectize/dist/js/selectize",
        sifter: "sifter/sifter.min"
    },
    shim: {
        bootstrap: {
            deps: ["jquery"]
        }
    }
});

requirejs(["knockout", "dist/js/knockout-bootstrap-modal", "knockout-selectize", "knockout-undomanager"], function(ko, modal, selectize, undomanager){
    function ViewModel() {
        this.viewmodel = {
            variable: ko.observable()
        }
    }

    ViewModel.prototype = {
        openModal: function() {
            var self = this;
            var instance = modal()
            .template("assets/modal.html", true)
            .large()
            .title("Something")
            .viewmodel(self.viewmodel)
            .save(function(promise, viewmodel){
                promise.resolve(true);
            })
            .show();
        }
    };

    ko.applyBindings(new ViewModel, document.getElementById("container"))
});