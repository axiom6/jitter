"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function () {
  var Order;

  Order = function () {
    var Order = function () {
      function Order(stream) {
        _classCallCheck(this, Order);

        this.stream = stream;
      }

      _createClass(Order, [{
        key: "ready",
        value: function ready(pane, spec) {
          pane.$.append("<h1>" + spec.name + "</h1>");
        }
      }, {
        key: "create",
        value: function create(pane, spec) {
          pane.$.append("<h1>" + spec.name + "</h1>");
        }
      }]);

      return Order;
    }();

    ;

    Jitter.Order = Order;

    return Order;
  }.call(this);
}).call(undefined);
