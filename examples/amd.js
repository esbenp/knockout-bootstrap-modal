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
        "knockout-subscriptions-manager": "knockout-subscriptions-manager/dist/knockout-subscriptions-manager",
        "knockout-change-subscriber": "knockout-change-subscriber/dist/knockout-change-subscriber",
        microplugin: "microplugin/src/microplugin",
        "selectable-placeholder": "knockout-selectize/plugins/selectablePlaceholder",
        selectize: "selectize/dist/js/selectize",
        sifter: "sifter/sifter.min",
        underscore: "underscore/underscore"
    },
    shim: {
        bootstrap: {
            deps: ["jquery"]
        }
    }
});

requirejs(["knockout", "dist/js/knockout-bootstrap-modal"], function(ko, modal, selectize, undomanager){
    function ViewModel() {
        this.viewmodel = {
            variable: ko.observable()
        }
    }

    ViewModel.prototype = {
        openModal: function() {
            var self = this;
            var instance = modal()
            .template("asd asdas dasd asdasdas as ?")
            .large()
            .header(false)
            .footer(false) 
            .title("Something")
            .save(function(promise, viewmodel){
                promise.resolve(true);
            })
            .show();
        }
    };

    ko.applyBindings(new ViewModel, document.getElementById("container"))
});