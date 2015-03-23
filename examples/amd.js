requirejs.config({
    baseUrl: '../bower_components',
    paths: {
        assets: "../examples/assets",
        dist: "../dist",

        bootstrap: "bootstrap/dist/js/bootstrap",
        jquery: "jquery/dist/jquery",
        knockout: "knockout/dist/knockout",
        "knockout-reactor": "knockoutjs-reactor-bower/knockout.reactor-beta",
        "knockout-undomanager": "knockout-undomanager-bower/knockout-undomanager-0.2",
        text: "requirejs-text/text",

        "knockout-bootstrap-modal-html": "../dist/html/modal.html"
    },
    shim: {
        bootstrap: {
            deps: ["jquery"]
        }
    }
});

requirejs(["knockout", "dist/js/knockout-bootstrap-modal"], function(ko, modal, selectize){
    function ViewModel() {
        this.viewmodel = {
            variable: ko.observable("YO")
        }
    }

    ViewModel.prototype = {
        openModal: function() {
            var self = this;
            var instance = modal()
            .template("assets/modal.html", true)
            .title("Something")
            .viewmodel(this.viewmodel)
            .save(function(promise, viewmodel){
                promise.resolve(true);
            })
            .show();

            setTimeout(function(){
                self.viewmodel.variable("HEJ");
                self.viewmodel.variable("MEN");
            }, 1500);
        }
    };

    ko.applyBindings(new ViewModel, document.getElementById("container"))
});