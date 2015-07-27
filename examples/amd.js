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

requirejs(["knockout", "dist/js/knockout-bootstrap-modal"], function(ko, modal){
    //modal.prototype.setDefaultOption("promptExternalTemplate", "assets/prompt.html");
    modal.prototype.extendDefaultOptions({
        promptExternalTemplate: "assets/prompt.html",
        templateVariables: {
            closeButtonLabel: 'Normal close',
            closeButtonLabelConfirm: 'Test confirm',
            saveButtonLabelConfirm: 'TEST YES confirm',
            saveButtonLabelAlert: 'Alert yes'
        }
    })

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
var i = 0;
    ViewModel.prototype = {
        openModal: function() {
            var self = this;
console.log("OPEN MODAL 1");
            var observable = ko.observable();
            var instance = modal()
            .confirm('test')
            .title('HEY')
            .header(true)
            .saveButtonLabel(i)
            .large()
            .save(function(promise){
                console.log("CALLBACK 1");
                promise.resolve();
            })
            .show();

i++

        },
        openModal2: function() {
            var self = this;
console.log("OPEN MODAL 2");
            var observable = ko.observable();

            var instance = modal()
            .alert('test')
            .show();
        }
    };

    var instance = new ViewModel;
    ko.applyBindings(instance, document.getElementById("container"));

    instance.openModal();
});
