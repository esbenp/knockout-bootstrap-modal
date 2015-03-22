requirejs.config({
    baseUrl: '../bower_components',
    paths: {
        dist: "../dist",

        bootstrap: "bootstrap/dist/js/bootstrap",
        jquery: "jquery/dist/jquery",
        knockout: "knockout/dist/knockout",
        text: "requirejs-text/text",

        "knockout-bootstrap-modal-html": "../dist/html/modal.html"
    },
    shim: {
        bootstrap: {
            deps: ["jquery"]
        }
    }
});

requirejs(["knockout", "dist/js/knockout-bootstrap-modal"], function(ko, modal){
    function ViewModel() {

    }

    ViewModel.prototype = {
        openModal: function() {
            modal()
            .template("examples/assets/modal.html")
            .save(function(){
                console.log("saving")
            })
            .show();
        }
    };

    ko.applyBindings(new ViewModel, document.getElementById("container"))
});