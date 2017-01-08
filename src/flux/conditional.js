'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ConditionalRequestAction = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _action = require('corky/flux/action');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var request = require('superagent');

var ConditionalRequestAction = function () {
    function ConditionalRequestAction(type, url, requestType,  requestAction,  callback,options) {
        _classCallCheck(this, ConditionalRequestAction);

        this.type = type;
        this.url = url;
        this.requestType = requestType;
        this.options = options || {};
        this.request = new _action.Action(type + '.REQUEST');
        this.response = new _action.Action(type + '.RESPONSE');
        this.error = new _action.Action(type + '.ERROR');
        this.callback = callback;
        this.requestAction = requestAction;
       
    }

    _createClass(ConditionalRequestAction, [{
        key: 'payload',
        value: function payload(_payload) {
            var _this = this;

            if (_payload === undefined) _payload = { data: {}, query: {} };
            if (_payload.data === undefined) _payload.data = {};
            if (_payload.query === undefined) _payload.query = {};

            if (this.url === undefined) throw new Error('Parameter url is missing in RequestAction: ' + this.type + '.');
            if (this.requestType === undefined) throw new Error('Parameter requestType is missing in RequestAction: ' + this.type + '.');

            return function (dispatch) {
                dispatch(_this.request.payload(_payload));

                var data = {};

                if (_payload.template === undefined) {
                    data.template = {};
                } else {
                    data.template = _payload.template;
                    delete _payload.template;
                }

                if (_payload.url === undefined) {
                    data.url = _this.url;
                } else {
                    data.url = _payload.url;
                    delete _payload.url;
                }

                if (_payload.requestType === undefined) {
                    data.requestType = _this.requestType;
                } else {
                    data.requestType = _payload.requestType;
                    delete _payload.requestType;
                }

                if (_payload.options === undefined) {
                    data.options = _this.options;
                } else {
                    data.options = _payload.options;
                    delete _payload.options;
                }

                if (_this.url === undefined) throw new Error('Parameter url is missing in RequestAction: ' + _this.type + '.');
                if (_this.requestType === undefined) throw new Error('Parameter requestType is missing in RequestAction: ' + _this.type + '.');

                var regex = /{(.*?)}/g;
                var match = [];

                while (match = regex.exec(data.url)) {
                    var key = match[0];
                    var value = match[1];

                    if (data.template[value] !== undefined) {
                        data.url = data.url.replace(key, data.template[value]);
                    }
                }
                data.callback = _this.callback;
                data.payload2 = _payload.payload2;
                data.request = _this.requestAction;
                request(data.requestType, data.url).send(_payload.data).query(_payload.query).set(data.options).end(function (err, res) {
                    if (err !== null) {
                        dispatch(_this.error.payload(err));
                    } else {
                        if (data.callback(res.body) === true) {
                            dispatch(_this.response.payload(res.body));
                            dispatch(data.request.payload(data.payload2));
                        }
                    }
                });
            };
        }
    }]);

    return ConditionalRequestAction;
}();

exports.ConditionalRequestAction = ConditionalRequestAction;