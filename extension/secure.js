// funkcija ob spremembi
var urlSensitiveAttributes = ["href", "src", "cite", "action", "longdesc", "poster"]
var okURLs = ['file:///', 'wss://echo.websocket.org', 'https://fri.uni-lj.si', 'https://www.facebook.com/', 'https://www.youtube.com/'];
var blockedUrlHash = '#__BLOCKED'

var isURLWhitelisted = function (url) {
    // debugger;
    if (!url || url === blockedUrlHash || url.startsWith('#')) return true
    // isti izvor
    if (url.startsWith('/') && !url.startsWith('//')) return true

    // ali se ujema vsaj z enim usreznim url
    var ok = okURLs.filter(prefix => url.startsWith(prefix)).length > 0

    // ce je ujemanje prekini
    if (ok) return true

    return false
}

var checkAttibuteUrl = function (target, attribute, value) {
    if (!isURLWhitelisted(value)) {
        // Popravi attribut
        console.warn("URL not allowed in attributes", value)
        target.setAttribute(attribute, blockedUrlHash)
    }
}

var DOMObserver = new MutationObserver(function (mutations) {
    "use strict"
    mutations.forEach(function (mutation) {

        if (mutation.type === 'attributes') {
            // Sprememba atributa na obstojecem elementu
            var changedAttribute = mutation.attributeName
            var attrValue = mutation.target.getAttribute(changedAttribute)

            if (attrValue !== undefined && urlSensitiveAttributes.includes(changedAttribute)) {
                checkAttibuteUrl(mutation.target, changedAttribute, attrValue)
            }
        }

        mutation.addedNodes.forEach(function (node) {
            // Vstavljeni elementi HTML
            if (node.attributes !== undefined) {
                var attrs = node.attributes
                var attrs = urlSensitiveAttributes
                    .map((a) => attrs.getNamedItem(a))
                    .filter(a => a !== null)

                attrs.forEach(a => checkAttibuteUrl(node, a.name, a.value))
            }



            if (node.classList && node.classList.contains(HIDE_ELEMENTS_WITH_CLASS)) {
                Object.defineProperty(node, 'HIDEME', {
                    value: true,
                    configurable: false
                })
            }

        })

    });
});


function hideElement (element) {
    console.log('Hidding')
    Object.defineProperty(element, 'HIDEME', {
        value: true,
        configurable: false
    })
}

// konfiguracija sledenja:
var config = { attributes: true, childList: true, characterData: true, subtree: true };


(function () {
    "use strict"

    var location = window.document.location;

    // Kljucavnice
    var pass = {
        ok: false,
        redirecting: false
    }

    // Krmilnik
    var prepreciNavigacijo = function () {
        var hash = location.hash;

        // URL kamor preusmerja brskalnik
        var nextHref = location.href;

        // Ali je bila preusmeritev odobrena (prejsna prozitev krmilnika)
        if (!pass.ok) {

            window.setTimeout(function () {
                //Hitro preusmeriu nazaj, da se izvedejo pogoji in 
                // potem preusmeri na ciljno stran
                location.hash = '____' + ~~(9999 * Math.random());
                location.hash = hash;

                // V postopku avtorizacije preusmerjanja
                pass.redirecting = true;

                //Preverjanje pogojev
                if (isURLWhitelisted(location.href)) {

                    // Odobri preusmeritev
                    pass.ok = true;
                    // Preusmeritev 
                    location.href = nextHref;

                } else {
                    // URL ni bil dovoljen
                    console.log(location.href)
                    throw 'URL not allowed'
                }
            }, 0);

            // Preusmeritev odobrena, ponastavi kljucavnice
        } else if (pass.redirecting) {
            pass.ok = false;
            pass.redirecting = false;
        }
    }

    window.addEventListener('beforeunload', prepreciNavigacijo, false);
    window.addEventListener('unload', prepreciNavigacijo, false);
}());

var wrapper = function (objektMetoda, Politika) {
    // Shranitev reference na originalno funkcijo
    var originalnaMetoda = objektMetoda.objekt[objektMetoda.metoda];

    // Nova funkcija
    var aspekt = function () {
        // Priprava končnih subjektov v lokalnem spominu
        var klic = {
            objekt: this,
            argumenti: arguments
        }

        //Klic politike s povratno funkcijo podano kot parameter
        return Politika.apply(klic.objekt, [objektMetoda.metoda, function () {
            //Klic originalne metode v kontekstu orginalnega objekta
            originalnaMetoda.apply(klic.objekt, klic.argumenti)
        }])

    }
    //Zamenjeva metode
    objektMetoda.objekt[objektMetoda.metoda] = aspekt
    return aspekt
}



var secureFunction = (function (Object) {
    // Lokalne reference
    var ObjectgetOwnPropertyDescriptor = Object.getOwnPropertyDescriptor
    var ObjectdefineProperty = Object.defineProperty

    var wrapper = function (objekt, metoda, Politika) {
        if (objekt === undefined || metoda === undefined || !(Politika instanceof Function)) {
            throw 'Napačni vhodni tipi'
        }

        // Shranitev reference na originalno funkcijo
        var atributi = ObjectgetOwnPropertyDescriptor(objekt, metoda)

        if (atributi === undefined || atributi.configurable !== true) {
            console.warn('Lastnost ni konfigurabilna: ' + metoda)
            return
        }

        var value = null; // Lokalna hramba dejanske vrednosti
        var getter = null, setter = null;

        if (atributi.value) {
            // podatkovna lastnost
            // Hrani vrednost skrito
            value = atributi.value

            // nadomestne funkcije za dostopanje do vrednosti
            getter = function () { return value }
            setter = function (val) { value = val }

        } else {
            // dostopna lastnost
            // shrani reference na originalne funkcije
            getter = atributi.get
            setter = atributi.set
        }

        // Nova ''beri'' funkcija
        var getAspekt = function () {
            //Klic politike s povratno funkcijo podano kot parameter
            // politika = function(tip, metoda, origFunkcija) - this = objekt
            return Politika.apply(this, ['GET', metoda, getter])
        }

        // Nova ''pisi'' funkcija
        var setAspekt = function () {
            //Klic politike s povratno funkcijo podano kot parameter
            // politika = function(tip, metoda, origFunkcija) - this = objekt
            return Politika.apply(this, ['SET', metoda, setter, arguments])
        }

        //Zamenjeva metode
        ObjectdefineProperty(objekt, metoda, {
            get: getAspekt,
            set: setAspekt,
            // prepreci brisanje ali prepisovanje nove lastnosti 
            configurable: false
        })
    }

    // Skrivanje definicije funkcije
    return function () {
        return wrapper.apply(this, arguments)
    }

}(Object))


var urlWhitelistPolicy = function (tip, metoda, origFunkcija) {
    // onemogocimo prepis funkcij
    if (tip === 'SET') return undefined

    // ce so podani argumenti preverimo ali je URL ustrezen
    // URL je prvi argument
    var wrap = function (url) {
        if (isURLWhitelisted(url)) {
            // Izvedi funkcijo
            return origFunkcija().apply(this, arguments)
        } else {
            throw 'URL ni dovoljen'
        }
    }
    return wrap
}

var urlWhitelistXMLHttpPolicy = function (tip, metoda, origFunkcija) {
    // onemogocimo prepis funkcij
    if (tip === 'SET') return undefined

    // ce so podani argumenti preverimo ali je URL ustrezen
    // URL je prvi argument
    var wrap = function (method, url) {
        if (isURLWhitelisted(url)) {
            // Izvedi funkcijo
            return origFunkcija().apply(this, arguments)
        } else {
            throw 'URL ni dovoljen'
        }
    }
    return wrap
}
var urlWhitelistSetterPolicy = function (tip, metoda, origFunkcija, args) {
    // onemogocimo prepis funkcij
    if (tip === 'GET') return origFunkcija.call(this)

    if (tip === 'SET') {
        var url = args.length > 0 ? args[0] : ''
        if (isURLWhitelisted(url)) {
            return origFunkcija.apply(this, args)
        } else {
            throw 'URL ni dovoljen'
        }
    }
}

var urlWhitelistConstructorPolicy = function (tip, metoda, origFunkcija) {
    // onemogocimo prepis funkcij
    if (tip === 'SET') return undefined

    // ce so podani argumenti preverimo ali je URL ustrezen
    // URL je prvi argument
    if (origFunkcija().prototype !== undefined) {
        return function (url) {
            if (isURLWhitelisted(url)) {
                // Vrni instanco prototipa
                return Reflect.construct(origFunkcija(), arguments)
            } else {
                throw 'URL ni dovoljen'
            }
        }
    }
}

var readOnlyPolicy = function (tip, metoda, origFunkcija) {
    // onemogocimo prepis funkcij
    if (tip === 'SET') return undefined

    return origFunkcija()

}

var writeOnlyPolicy = function (tip, metoda, origFunkcija, args) {
    // onemogocimo prepis funkcij
    if (tip === 'GET') return undefined

    return origFunkcija.apply(this, args)

}

var noAccessPolicy = function (tip, metoda) {
    // onemogocimo prepis funkcij
    var err = new Error();
    console.log(err.stack);
    throw '[' + tip + ' ' + metoda + '] Dostop zavrnjen '
}


///////////////////////////////////////////////


var HIDE_ELEMENTS_WITH_CLASS = "____HIDEME____";

const filterElements = function (elements) {
    if (elements === null) return elements
    return Array.from(elements).filter(el => el.HIDEME !== true)
}

const filterElement = function (element) {
    if (element === null) return element
    return element.HIDEME === true ? null : element
}

const htmlMultipleOutHideFnProlicy = function (tip, metoda, origFunkcija, args) {
    // onemogocimo prepis funkcij
    if (tip === 'SET') return undefined

    // ce so podani argumenti preverimo ali je URL ustrezen
    // URL je prvi argument
    var wrap = function () {
        var out = origFunkcija().apply(this, arguments)

        return filterElements(out)
    }
    return wrap
}

const htmlMultipleOutHideProlicy = function (tip, metoda, origFunkcija, args) {
    // onemogocimo prepis funkcij
    if (tip === 'SET') return undefined

    // ce so podani argumenti preverimo ali je URL ustrezen
    // URL je prvi argument
    var out = origFunkcija.apply(this, arguments)

    return filterElements(out)
}

const htmlSingleOutHideFnProlicy = function (tip, metoda, origFunkcija, args) {
    // onemogocimo prepis funkcij
    if (tip === 'SET') return undefined

    // ce so podani argumenti preverimo ali je URL ustrezen
    // URL je prvi argument
    var wrap = function () {
        var out = origFunkcija().apply(this, arguments)

        return filterElement(out)
    }
    return wrap
}

const htmlSingleOutHideProlicy = function (tip, metoda, origFunkcija, args) {
    // onemogocimo prepis funkcij
    if (tip === 'SET') return undefined

    // ce so podani argumenti preverimo ali je URL ustrezen
    // URL je prvi argument
    var out = origFunkcija.apply(this, arguments)

    return filterElement(out)
}

var protectDOM = function () {

    // mutiple out - functions
    secureFunction(Document.prototype, 'getElementsByClassName', htmlMultipleOutHideFnProlicy)
    secureFunction(Document.prototype, 'getElementsByTagName', htmlMultipleOutHideFnProlicy)
    secureFunction(Document.prototype, 'elementsFromPoint', htmlMultipleOutHideFnProlicy)

    secureFunction(Element.prototype, 'getElementsByClassName', htmlMultipleOutHideFnProlicy)
    secureFunction(Element.prototype, 'getElementsByTagName', htmlMultipleOutHideFnProlicy)
    secureFunction(Element.prototype, 'getElementsByTagNameNS', htmlMultipleOutHideFnProlicy)
    secureFunction(Element.prototype, 'querySelectorAll', htmlMultipleOutHideFnProlicy)


    // multiple out
    secureFunction(Node.prototype, 'childNodes', htmlMultipleOutHideProlicy)
    secureFunction(Element.prototype, 'children', htmlMultipleOutHideProlicy)
    secureFunction(Document.prototype, 'children', htmlMultipleOutHideProlicy)
    secureFunction(Document.prototype, 'hidden', htmlMultipleOutHideProlicy)
    secureFunction(Document.prototype, 'images', htmlMultipleOutHideProlicy)
    secureFunction(HTMLDocument.prototype, 'images', htmlMultipleOutHideProlicy)
    secureFunction(window, 'frames', htmlMultipleOutHideProlicy)
    secureFunction(Document.prototype, 'links', htmlMultipleOutHideProlicy)
    secureFunction(HTMLDocument.prototype, 'all', htmlMultipleOutHideProlicy)
    secureFunction(Document.prototype, 'scripts', htmlMultipleOutHideProlicy)


    // single out 
    secureFunction(Node.prototype, 'parentNode', htmlSingleOutHideProlicy)
    secureFunction(Node.prototype, 'firstChild', htmlSingleOutHideProlicy)
    secureFunction(Node.prototype, 'getRootNode', htmlSingleOutHideProlicy)
    secureFunction(Node.prototype, 'lastChild', htmlSingleOutHideProlicy)
    secureFunction(Node.prototype, 'ownerDocument', htmlSingleOutHideProlicy)
    secureFunction(Node.prototype, 'parentElement', htmlSingleOutHideProlicy)
    secureFunction(Node.prototype, 'previousSibling', htmlSingleOutHideProlicy)

    secureFunction(Element.prototype, 'closest', htmlSingleOutHideProlicy)
    secureFunction(Element.prototype, 'firstElementChild', htmlSingleOutHideProlicy)
    secureFunction(Element.prototype, 'lastElementChild', htmlSingleOutHideProlicy)
    secureFunction(Element.prototype, 'nextElementSibling', htmlSingleOutHideProlicy)
    secureFunction(Element.prototype, 'previousElementSibling', htmlSingleOutHideProlicy)

    secureFunction(Document.prototype, 'body', htmlSingleOutHideProlicy)
    secureFunction(Document.prototype, 'head', htmlSingleOutHideProlicy)
    secureFunction(Document.prototype, 'documentElement', htmlSingleOutHideProlicy)
    secureFunction(Document.prototype, 'rootElement', htmlSingleOutHideProlicy)
    secureFunction(Document.prototype, 'lastElementChild', htmlSingleOutHideProlicy)
    secureFunction(Document.prototype, 'firstElementChild', htmlSingleOutHideProlicy)

    // single out - functions
    secureFunction(Element.prototype, 'querySelector', htmlSingleOutHideFnProlicy)
    secureFunction(Element.prototype, 'webkitMatchesSelector', htmlSingleOutHideFnProlicy)
    secureFunction(Document.prototype, 'elementFromPoint', htmlSingleOutHideFnProlicy)
    secureFunction(Document.prototype, 'getElementById', htmlSingleOutHideFnProlicy)
    secureFunction(Document.prototype, 'scrollingElement', htmlSingleOutHideFnProlicy)


    //Event
    secureFunction(Event.prototype, 'currentTarget', htmlSingleOutHideProlicy)
    secureFunction(Event.prototype, 'target', htmlSingleOutHideProlicy)
    secureFunction(Event.prototype, 'srcElement', htmlSingleOutHideProlicy)
}

var protectElement = (function () {
    'use strict'
    var NOCHANGES_CLASS = '____INTEGRITY_____'

    var protectedElements = []


    var integrityFunction = function (mutations) {
        mutations.forEach(function (mutation) {

            let target = mutation.target

            // check if mutation re
            var element = protectedElements.find(pe => pe.element === target)

            if (mutation.type === 'attributes') {
                // Sprememba atributa na obstojecem elementu
                var changedAttribute = mutation.attributeName
                var newValue = target.getAttribute(changedAttribute)

                // Compare values
                if (element.attrs[changedAttribute] === undefined) {
                    //Prva sprememba - shrani vrednost
                    element.attrs[changedAttribute] = mutation.oldValue
                }

                if (element.attrs[changedAttribute] !== newValue) {
                    target.setAttribute(changedAttribute, mutation.oldValue)
                    return

                }
            }

            if (mutation.type === 'characterData') {

                var newValue = target.data
                // Compare values
                if (element.data === undefined) {
                    //Prva sprememba - shrani vrednost
                    element.data = mutation.oldValue
                }

                if (element.data !== newValue) {
                    target.data = mutation.oldValue
                    return
                }
            }
        })
    }


    var options = {
        attributes: true,
        characterData: true,
        attributeOldValue: true,
        characterDataOldValue: true
    }

    var elementIntegrity = function (element, options) {

        var observer = new MutationObserver(integrityFunction);
        protectedElements.push({
            element: element,
            attrs: {},
            data: undefined
        })

        observer.observe(element, options)


        return function unprotect () {
            observer.disconnect()
        }
    }

    var elements = document.getElementsByClassName(NOCHANGES_CLASS)
    if (elements) {
        Array.from(elements).forEach(el => elementIntegrity(el, options))
    }

    return function (element) {
        return elementIntegrity(element, options)
    }

}())