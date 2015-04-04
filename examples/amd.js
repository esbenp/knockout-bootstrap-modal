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
        "knockout-memento": "knockout-memento-bower/dist/knockout-memento-bower",
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

requirejs(["knockout", "dist/js/knockout-bootstrap-modal", "knockout-memento"], function(ko, modal, ko){
    function ViewModel() {
        this.variants = ko.observableArray([new VariantModel([
                new PriceModel("USD")
            ])]);
        this.simple = ko.observable("Undo");
    }

    function VariantModel(prices) {
        this.prices = ko.observableArray(prices);

        this.test = ko.computed(function() {
            return this.prices();
        }, this);

        //this.yooyoyoyo.watch(false);
    }

    function PriceModel(currency) {
        this.currency = ko.observable(currency);
    }

    ViewModel.prototype = {
        openModal: function() {
            var self = this;

            var instance = modal()
            .template("assets/modal.html", true)
            .large()
            .title("Something")
            .viewmodel({
                add: function() {
                    self.variants()[0].prices.push(new PriceModel("DKK"));
                    self.simple("YO");
                },
                simple: self.simple,
                variants: self.variants
            })
            .save(function(promise, viewmodel){
                promise.resolve(true);
            })
            .show();
        }
    };

    var instance = new ViewModel;
    ko.applyBindings(instance, document.getElementById("container"));

    instance.openModal();
});