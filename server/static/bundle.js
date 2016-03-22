(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/** @jsx m */

Store = require('./store');

var App = {
    state: {},
    _onChange: function () {
        App.state = Store.getAll();
    },

    controller: function () {
        this.onUpload = function (e) {
            e.preventDefault();
            var fileObject = e.target[0].files[0];

            return m.request({
                method: "POST",
                url: "/dataset",
                data: fileObject,
                serialize: function (uploadedFile) {
                    var formData = new FormData();
                    formData.append(uploadedFile.name, uploadedFile);
                    return formData
                }
            })
        }
    },

    view: function (ctrl) {
        return (
            {tag: "form", attrs: {id:"uploadForm", onsubmit:ctrl.onUpload}, children: [
                {tag: "input", attrs: {type:"file", name:"fileUpload", formenctype:"multipart/form-data"}}, 
                {tag: "button", attrs: {type:"submit", value:"upload"}, children: ["Upload"]}
            ]}
        );
    }
};

Store.addChangeListener(App._onChange);

m.module(document.getElementById("waterfall"), App);

},{"./store":2}],2:[function(require,module,exports){
var Bullet = require('bullet-pubsub');
var Constants = {
    CHANGE_EVENT: 'CHANGE_EVENT',
    ActionTypes: {}
};

var dataset, equation;

var Store = {

    getall: function () {
        return {
            dataset: dataset || {},
            equation: equation || ""
        }
    },
    addChangeListener: function (callback) {
        Bullet.on(Constants.CHANGE_EVENT, callback);
    },
    removeChangeListener: function (callback) {
        Bullet.removeListener(Constants.CHANGE_EVENT, callback);
    },
    emitChange: function () {
        Bullet.trigger(Constants.CHANGE_EVENT);
    },

    dispatchIndex: function (payload) {
        console.log(payload);
        switch (payload.type) {
        }
    }
};

module.exports = Store;
},{"bullet-pubsub":3}],3:[function(require,module,exports){
(function () {

    'use strict';
    
    function Bullet ()
    {
        // ------------------------------------------------------------------------------------------
        // -- Custom Errors
        // ------------------------------------------------------------------------------------------
        function ParamCountError (methodName, expectedParamsString, paramCount) {
            
            this.message = 'Bullet:: [' + methodName + '] ' + expectedParamsString + ', but received: ' + paramCount;
            var error = new Error(this.message);
            if (typeof error.stack !== 'undefined') this.stack = error.stack;
        }
        ParamCountError.prototype = new Error();
        ParamCountError.prototype.name = ParamCountError.name;
        ParamCountError.prototype.constructor = ParamCountError;

        function ParamTypeError (methodName, parameterName, parameter, expectedType) {
            
            this.message = 'Bullet:: [' + methodName + '] Expected parameter - ' + parameterName + ' - to be type: ' + expectedType + ', but received type: ' + typeof parameter;
            var error = new TypeError(this.message);
            if (typeof error.stack !== 'undefined') this.stack = error.stack;
        }
        ParamTypeError.prototype = new TypeError();
        ParamTypeError.prototype.name = ParamTypeError.name;
        ParamTypeError.prototype.constructor = ParamTypeError;

        function EventNameLengthError (methodName) {
            
            this.message = 'Bullet:: [' + methodName + '] Expected event name parameter to be longer than 0 characters';
            var error = new Error(this.message);
            if (typeof error.stack !== 'undefined') this.stack = error.stack;
        }
        EventNameLengthError.prototype = new Error();
        EventNameLengthError.prototype.name = EventNameLengthError.name;
        EventNameLengthError.prototype.constructor = EventNameLengthError;


        function UndeclaredEventError (methodName, eventName) {
            
            this.message = 'Bullet:: [' + methodName + '] Event string: "' + eventName + '" does not exist within the events dictionary\nPlease use the Bullet.addEventName method to add this string.';

            var error = new Error(this.message);
            if (typeof error.stack !== 'undefined') this.stack = error.stack;
        }
        UndeclaredEventError.prototype = new Error();
        UndeclaredEventError.prototype.name = UndeclaredEventError.name;
        UndeclaredEventError.prototype.constructor = UndeclaredEventError;


        function UnmappedEventError (methodName, eventName) {
            
            this.message = 'Bullet:: [' + methodName + '] Event string: "' + eventName + '" is not mapped to any callbacks\nPlease use the Bullet.on method to map this string to a callback.';

            var error = new Error(this.message);
            if (typeof error.stack !== 'undefined') this.stack = error.stack;
        }
        UnmappedEventError.prototype = new Error();
        UnmappedEventError.prototype.name = UnmappedEventError.name;
        UnmappedEventError.prototype.constructor = UnmappedEventError;


        // ------------------------------------------------------------------------------------------
        // -- Private variables
        // ------------------------------------------------------------------------------------------
        var _self = this;
        var _mappings = {};
        var _strictMode = false;
        var _triggerAsync = true;

        // Expose custom error type constructors (for testing), but use an underscore to imply privacy.
        _self._errors = {
            ParamCountError : ParamCountError,
            ParamTypeError : ParamTypeError,
            EventNameLengthError : EventNameLengthError,
            UndeclaredEventError : UndeclaredEventError,
            UnmappedEventError : UnmappedEventError,
        };


        // ------------------------------------------------------------------------------------------
        // -- Public variables
        // ------------------------------------------------------------------------------------------
        _self.events = {};


        // ------------------------------------------------------------------------------------------
        // -- Private methods
        // ------------------------------------------------------------------------------------------
        function _cloneCallbacks (callbacks) {
            var clonedCallbacks = {};

            for (var callbackName in callbacks) {
                
                clonedCallbacks[callbackName] = {
                    cb : callbacks[callbackName].cb,
                    once : callbacks[callbackName].once
                };
            }

            return clonedCallbacks;
        }

        // Expose _getMappings method (for testing), but use an underscore to imply privacy.
        _self._getMappings = function () {
            
            // Return a dictionary object that has no effect on app state to ensure '_mappings'
            // stays private, even if the value returned from this method is modified.
            var clonedMappings = {};

            for (var mapping in _mappings)
            {             
                clonedMappings[mapping] = {
                    callbacks : _cloneCallbacks(_mappings[mapping].callbacks),
                    totalCallbacks : _mappings[mapping].totalCallbacks
                };
            }

            return clonedMappings;
        };


        // ------------------------------------------------------------------------------------------
        // -- Public methods
        // ------------------------------------------------------------------------------------------
        _self.on = function (eventName, fn, once)
        {
            if (arguments.length < 2 || arguments.length > 3)
            {
                throw new ParamCountError('on', 'Expected between 2 and 3 parameters', arguments.length);
            }

            if (typeof eventName !== 'string')
            {
                throw new ParamTypeError('on', 'event name', eventName, 'string');
            }
            else if (eventName.length === 0)
            {
                throw new EventNameLengthError('on');
            }
            else if (_strictMode && typeof _self.events[eventName] === 'undefined')
            {
                throw new UndeclaredEventError('on', eventName);
            }

            if (typeof fn !== 'function')
            {
                throw new ParamTypeError('on', 'callback', fn, 'function');
            }

            if (typeof once !== 'undefined' && typeof once !== 'boolean')
            {
                throw new ParamTypeError('on', 'once', once, 'boolean');
            }

            var fnString = fn.toString();

            // If the named event object already exists in the dictionary...
            if (typeof _mappings[eventName] !== 'undefined')
            {
                // Add a callback object to the named event object if one doesn't already exist.
                if (typeof _mappings[eventName].callbacks[fnString] === 'undefined')
                {
                    _mappings[eventName].callbacks[fnString] = {
                        cb : fn,
                        once : typeof once === 'boolean' ? once : false
                    };

                    _mappings[eventName].totalCallbacks++;
                }
                else if (typeof once === 'boolean')
                {
                    // The function already exists, so update it's 'once' value.
                    _mappings[eventName].callbacks[fnString].once = once;
                }
            }
            else
            {
                // Create a new event object in the dictionary with the specified name and callback.
                _mappings[eventName] = {
                    callbacks : {}
                };

                _mappings[eventName].callbacks[fnString] = {cb : fn, once : !!once};
                _mappings[eventName].totalCallbacks = 1;
            }
        };

        _self.once = function (eventName, fn)
        {
            if (arguments.length !== 2)
            {
                throw new ParamCountError('once', 'Expected 2 parameters', arguments.length);
            }
            else if (typeof eventName !== 'string')
            {
                throw new ParamTypeError('once', 'event name', eventName, 'string');
            }
            else if (eventName.length === 0)
            {
                throw new EventNameLengthError('once');
            }
            else if (_strictMode && typeof _self.events[eventName] === 'undefined')
            {
                throw new UndeclaredEventError('once', eventName);
            }

            if (typeof fn !== 'function')
            {
                throw new ParamTypeError('once', 'callback', fn, 'function');
            }

            _self.on(eventName, fn, true);
        };

        _self.off = function (eventName, fn)
        {
            if (arguments.length === 0)
            {
                // Remove all mappings.
                _mappings = {};
                return;
            }
            else if (typeof eventName !== 'string')
            {
                throw new ParamTypeError('off', 'event name', eventName, 'string');
            }
            else if (eventName.length === 0)
            {
                throw new EventNameLengthError('off');
            }
            else if (_strictMode && typeof _self.events[eventName] === 'undefined')
            {
                throw new UndeclaredEventError('off', eventName);
            }

            if (typeof _mappings[eventName] === 'undefined')
            {
                // There is no mapping to remove, so return silently.
                return;
            }

            // Remove just the function, if passed as a parameter and in the dictionary.
            if (typeof fn === 'function')
            {
                var fnString = fn.toString(),
                    fnToRemove = _mappings[eventName].callbacks[fnString];

                if (typeof fnToRemove !== 'undefined')
                {
                    // delete the callback object from the dictionary.
                    delete _mappings[eventName].callbacks[fnString];
                    
                    _mappings[eventName].totalCallbacks--;

                    if (_mappings[eventName].totalCallbacks === 0)
                    {
                        // There are no more functions in the dictionary that are
                        // registered to this event, so delete the named event object.
                        delete _mappings[eventName];
                    }
                }
            }
            else if (typeof fn !== 'undefined')
            {
                throw new ParamTypeError('off', 'callback', fn, 'function');
            }
            else
            {
                // No callback was passed, so delete all functions in the dictionary that
                // are registered to this event by deleting the named event object.
                delete _mappings[eventName];
            }
        };

        // Replace a single mapped callback for the specified event name with a new callback.
        _self.replaceCallback = function (eventName, oldFn, newFn, once) {

            if (typeof eventName !== 'string')
            {
                throw new ParamTypeError('replaceCallback', 'event name', eventName, 'string');
            }
            else if (eventName.length === 0)
            {
                throw new EventNameLengthError('replaceCallback');
            }
            else if (typeof _mappings[eventName] === 'undefined')
            {
                throw new UnmappedEventError('replaceCallback', eventName);
            }
            else if (_strictMode && typeof _self.events[eventName] === 'undefined')
            {
                throw new UndeclaredEventError('replaceCallback', eventName);
            }

            if (typeof oldFn !== 'function')
            {
                throw new ParamTypeError('replaceCallback', 'callback', oldFn, 'function');
            }

            if (typeof newFn !== 'function')
            {
                throw new ParamTypeError('replaceCallback', 'callback', newFn, 'function');
            }

            if (typeof once !== 'undefined' && typeof once !== 'boolean')
            {
                throw new ParamTypeError('replaceCallback', 'once', once, 'boolean');
            }
            
            _self.off(eventName, oldFn);
            _self.on(eventName, newFn, once);
        };

        // Replace all of the specified event name’s mapped callbacks with the specified callback.
        _self.replaceAllCallbacks = function (eventName, newFn, once) {

            if (typeof eventName !== 'string')
            {
                throw new ParamTypeError('replace', 'event name', eventName, 'string');
            }
            else if (eventName.length === 0)
            {
                throw new EventNameLengthError('replace');
            }
            else if (typeof _mappings[eventName] === 'undefined')
            {
                throw new UnmappedEventError('replace', eventName);
            }
            else if (_strictMode && typeof _self.events[eventName] === 'undefined')
            {
                throw new UndeclaredEventError('replace', eventName);
            }

            if (typeof newFn !== 'function')
            {
                throw new ParamTypeError('replace', 'callback', newFn, 'function');
            }

            if (typeof once !== 'undefined' && typeof once !== 'boolean')
            {
                throw new ParamTypeError('replace', 'once', once, 'boolean');
            }
            
            _self.off(eventName);
            _self.on(eventName, newFn, once);
        };

        _self.trigger = function (eventName, data)
        {
            if (typeof eventName !== 'string')
            {
                throw new ParamTypeError('trigger', 'event name', eventName, 'string');
            }
            else if (eventName.length === 0)
            {
                throw new EventNameLengthError('trigger');
            }
            else if (_strictMode && typeof _self.events[eventName] === 'undefined')
            {
                throw new UndeclaredEventError('trigger', eventName);
            }
            
            if (typeof _mappings[eventName] === 'undefined')
            {
                if (_strictMode) throw new UnmappedEventError('trigger', eventName);

                // Return silently if not in strict mode.
                return;
            }

            function runCallback () {
                for (var fnString in _mappings[eventName].callbacks)
                {
                    var callbackObject = _mappings[eventName].callbacks[fnString];

                    if (typeof callbackObject.cb === 'function') callbackObject.cb(data);
                    if (typeof callbackObject.once === 'boolean' && callbackObject.once === true) _self.off(eventName, callbackObject.cb);
                }
            }

            // Check whether or not this is a browser environment.
            if (_triggerAsync && typeof window !== 'undefined')
            {
                window.setTimeout(runCallback, 0);
            }
            else
            {
                runCallback();
            }
        };

        _self.addEventName = function (eventName) {

            if (typeof eventName !== 'string')
            {
                throw new ParamTypeError('addEventName', 'event name', eventName, 'string');
            }
            else if (eventName.length === 0)
            {
                throw new EventNameLengthError('addEventName');
            }

            _self.events[eventName] = eventName;
        };

        _self.removeEventName = function (eventName) {

            if (typeof eventName !== 'string')
            {
                throw new ParamTypeError('removeEventName', 'event name', eventName, 'string');
            }
             else if (eventName.length === 0)
            {
                throw new EventNameLengthError('removeEventName');
            }

            if (_self.events[eventName]) delete _self.events[eventName];
        };

        _self.getStrictMode = function () {

            // Return a boolean that doesn't directly point to the internal '_strictMode' property.
            return _strictMode === true ? true : false;
        };

        _self.setStrictMode = function (useStrictMode) {

            if (typeof useStrictMode !== 'boolean') throw new ParamTypeError('setStrictMode', 'strict mode', useStrictMode, 'boolean');

            _strictMode = useStrictMode;
        };

        _self.getTriggerAsync = function () {

            // Return a boolean that doesn't directly point to the internal '_triggerAsync' property.
            return _triggerAsync === true ? true : false;
        };

        _self.setTriggerAsync = function (useAsync) {

            if (typeof useAsync !== 'boolean') throw new ParamTypeError('setTriggerAsync', 'trigger async', useAsync, 'boolean');

            _triggerAsync = useAsync;
        }

        // TODO : Create an 'addMultipleEventNames' method with an array of strings passed as a param.
        // - include type checks for string while looping over the array.

        // TODO : Create a 'replaceAllEventNames' method with an array of strings passed as a param.
        // - include type checks for string while looping over the array.

        // TODO : Create a 'removeAllEventNames' method. No params necessary.
        // – Internally this could simply call 'replaceAllEventNames' and pass an empty array as a param.

        // TODO : Create an 'onAny' method with an array of strings passed as the first param and a single callback as the second.
        // - include type checks for string while looping over the array.

        // TODO : Create an 'onMultiple' method with an array of flat objects passed as a param.
        // - example of required param structure:
        // [{eventName: 'someEvent', callback: someCallback, once: false}, {eventName: 'anotherEvent', callback: anotherCallback, once: true}]
    }


    // ------------------------------------------------------------------------------------------
    // -- Module definition
    // ------------------------------------------------------------------------------------------
    // Check for AMD/Module support, otherwise define Bullet as a global variable.

    if (typeof define !== 'undefined' && define.amd)
    {
        // AMD. Register as an anonymous module.
        define (function()
        {
            return new Bullet();
        });

    }
    else if (typeof module !== 'undefined' && module.exports)
    {
        module.exports = new Bullet();
    }
    else
    {
        window.Bullet = new Bullet();
    }
    
})();
},{}]},{},[1]);