var evaluateInputAsNodeElement = function(input, context, throwOnFail) {
    // Input is a javascript node
    if (input.nodeType) {
        return $(input);
    // Input is a jQuery instance
    } else if(input instanceof jQuery) {
        return input;
    // Fallback: input is a selector
    } else {
        var element = $(input, context);

        if (element.length === 0 && throwOnFail !== false) {
            throw Error("Knockout-bootstrap-modal: Could not find element with selector '" 
                        + input + "'");
        }

        return element;
    }
}

var fireIfFunction = function(){
    var func = arguments[0];

    if (!isFunction(func)) {
        return false;
    }

    var args = Array.prototype.slice.call(arguments);

    // remove the function
    args.shift();
    
    return func.apply(this, args);
}

var isFunction = function(input) {
    return input instanceof Function;
}