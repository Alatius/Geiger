'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ContextFactory = exports.Store = exports.Action = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _events = require('events');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Action = exports.Action = function (_EventEmitter) {
    _inherits(Action, _EventEmitter);

    function Action() {
        _classCallCheck(this, Action);

        return _possibleConstructorReturn(this, (Action.__proto__ || Object.getPrototypeOf(Action)).apply(this, arguments));
    }

    return Action;
}(_events.EventEmitter);

var Store = exports.Store = function (_EventEmitter2) {
    _inherits(Store, _EventEmitter2);

    function Store() {
        var _ref;

        _classCallCheck(this, Store);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        var _this2 = _possibleConstructorReturn(this, (_ref = Store.__proto__ || Object.getPrototypeOf(Store)).call.apply(_ref, [this].concat(args)));

        _this2.dispatching = [];
        _this2.waiting = [];
        return _this2;
    }

    _createClass(Store, [{
        key: 'changed',
        value: function changed() {
            this.emit('change');
        }
    }, {
        key: 'watch',
        value: function watch(cbk) {
            var _this3 = this;

            this.on('change', cbk);
            return function () {
                return _this3.removeListener('change', cbk);
            };
        }
    }, {
        key: 'isDispatching',
        value: function isDispatching() {
            return this.dispatching.length > 0;
        }
    }, {
        key: 'isWaiting',
        value: function isWaiting() {
            return this.waiting.length > 0;
        }
    }, {
        key: 'listen',
        value: function listen(actions, event, cbk) {
            var _this4 = this;

            if ((typeof actions === 'undefined' ? 'undefined' : _typeof(actions)) !== 'object' || typeof actions.on !== 'function') {
                throw new Error('Store ' + this.constructor.name + '.listen() method expects an EventEmitter-compatible object as a first parameter.');
            }

            actions.on(event, function () {

                // dispatching begins
                _this4.dispatching.push(event);

                var res = cbk.apply(undefined, arguments);
                var ispromise = (typeof res === 'undefined' ? 'undefined' : _typeof(res)) === 'object' && typeof res.then === 'function';

                if (_this4.isWaiting() && !ispromise) {
                    throw new Error('Store ' + _this4.constructor.name + ' waiting; action has to return the waiting promise (the promise returned by waitFor).');
                }

                var dispatchingEnd = function dispatchingEnd() {
                    _this4.dispatching.pop();
                    _this4.emit('dispatching:end', event);
                    // dispatching ends
                };

                if (ispromise) {
                    res.then(dispatchingEnd);
                } else {
                    dispatchingEnd();
                }

                return res;
            });
        }
    }, {
        key: 'wait',
        value: function wait() {
            console.log('Geiger: wait() is deprecated in favour of waitFor(). Please, update your codebase.');
            return this.waitFor.apply(this, arguments);
        }
    }, {
        key: 'waitFor',
        value: function waitFor(stores) {
            var _this5 = this;

            this.waiting.push(true);

            var promises = [];

            (Array.isArray(stores) ? stores : [stores]).map(function (store) {
                if (store.isDispatching()) {
                    promises.push(new Promise(function (resolve) {
                        return store.once('dispatching:end', resolve);
                    }));
                } else {
                    promises.push(true);
                }
            });

            return Promise.all(promises).then(function () {
                return _this5.waiting.pop();
            });
        }
    }]);

    return Store;
}(_events.EventEmitter);

var ContextFactory = exports.ContextFactory = function ContextFactory(propTypes) {
    var _class, _temp;

    return _temp = _class = function (_Component) {
        _inherits(FactoriedContext, _Component);

        function FactoriedContext() {
            _classCallCheck(this, FactoriedContext);

            return _possibleConstructorReturn(this, (FactoriedContext.__proto__ || Object.getPrototypeOf(FactoriedContext)).apply(this, arguments));
        }

        _createClass(FactoriedContext, [{
            key: 'getChildContext',
            value: function getChildContext() {
                var res = {};
                for (var propname in propTypes) {
                    res[propname] = this.props[propname];
                }
                return res;
            }
        }, {
            key: 'render',
            value: function render() {
                return this.props.render();
            }
        }]);

        return FactoriedContext;
    }(_react.Component), _class.childContextTypes = propTypes, _class.propTypes = propTypes, _temp;
};
//# sourceMappingURL=geiger.js.map