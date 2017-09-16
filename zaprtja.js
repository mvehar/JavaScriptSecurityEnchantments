

var test = function () {
	var value = 'SECRET TEXT'

    // nadomestne funkcije za dostopanje do vrednosti
    return function(app) { return value+app }
}

var test2 = test()



var Module = (function() {
    var privateProperty = 'foo';

    function privateMethod(args) {
        // do something
    }

    return {

        publicProperty: '',

        publicMethod: function(args) {
            // do something
        },

        privilegedMethod: function(args) {
            return privateMethod(args);
        }
    };
})();

