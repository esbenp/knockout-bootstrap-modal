define(["src/js/utilities", "jquery"], function(utilities, $){
    describe("utilities", function(){
        describe("evaluateInputAsNodeElement", function(){
            var self = this;
            var func = evaluateInputAsNodeElement;

            self.container = $("<div/>").appendTo("body");
            self.child = $("<div/>").appendTo(self.container);

            self.container.attr("id", "container").addClass("container");
            self.child.addClass("child");

            it("should return a jQuery object if given a javascript node", function(){
                expect(func(self.container[0])).toEqual(jasmine.any(jQuery));
            });

            it("should return an jQuery object if given a jQuery instance", function(){
                expect(func(self.child)).toEqual(jasmine.any(jQuery));
            });

            it("should return an jQuery object if a selector is given", function(){
                expect(func(".child")).toEqual(jasmine.any(jQuery));
            });

            it("should return an jQuery object with a context if selector and context is given", function(){
                var object = func(".child", self.container[0]);
                expect(object).toEqual(jasmine.any(jQuery));
                expect("container").toEqual("container");
            });

            it("should throw an error if element is not found", function(){
                expect(function(){func("test")}).toThrow();
            });

            it("should not throw an error if throw flag is false and element is not found", function(){
                expect(func("test", undefined, false)).toBeTruthy();
            });
        });

        describe("fireIfFunction", function(){
            var self = this;
            var func = fireIfFunction;
            var callback;
            var spy;

            beforeEach(function(){
                spy = jasmine.createSpy("spy");
                callback = spy;
            });

            it("should fire first argument as function if it is a function", function(){
                func(callback);
                expect(spy).toHaveBeenCalled();
            });

            it("should return false if first argument is not a function", function(){
                var returnValue = func("notAFunction");
                expect(spy.calls.count()).toEqual(0);
                expect(returnValue).toEqual(false);
            });

            it("should append arguments to callback function", function(){
                func(callback, 1, 2, 3);
                expect(spy.calls.argsFor(0)).toEqual([1, 2, 3]);
            });
        });

        describe("isFunction", function(){
            var func = isFunction;
            var callback = function(){};

            it("should return true if given a function", function(){
                expect(func(callback)).toEqual(true);
            });

            it("should return false if not given a function", function(){
                expect(func("notAFunction")).toEqual(false);
            });
        });
    });
});