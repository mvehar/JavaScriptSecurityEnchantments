// secureFunction(window, 'XMLHttpRequest', urlWhitelistConstructorPolicy);
// console.log(XMLHttpRequest.prototype.open);
// XMLHttpRequest.prototype.open = console.log;

(function () {
    var noBlobConstructorPolicy = function (tip, metoda, origFunkcija) {
        // onemogocimo prepis funkcij
        if (tip === 'SET') return undefined

        // ce so podani argumenti preverimo ali je parameter DOMString ustrezen
        if (origFunkcija().prototype !== undefined) {
            return function (url) {
                console.log(url);
                if (url && url.constructor !== DOMString) {
                    // Vrni instanco prototipa
                    return Reflect.construct(origFunkcija(), arguments)
                } else {
                    throw 'URL ni dovoljen'
                }
            }
        }
    }
    secureFunction(window, 'Worker', noBlobConstructorPolicy);

    console.log("secured", XMLHttpRequest.prototype.open);
})()