requirejs.config({
    baseUrl: '../bower_components',
    paths: {
        dist: "../dist",

        bootstrap: "bootstrap/dist/js/bootstrap",
        jquery: "jquery/dist/jquery",
        knockout: "knockout/dist/knockout"
    },
    shim: {
        bootstrap: {
            deps: ["jquery"]
        }
    }
});

requirejs(["knockout", "dist/knockout-bootstrap-modal"], function(ko, selectize){
    function ViewModel() {

    }

    ViewModel.prototype = {
        openModal: function() {
            
        }
    };

    ko.applyBindings(new ViewModel, document.getElementById("container"))
});