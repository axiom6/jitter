"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function () {
  var Drink;

  Drink = function () {
    var Drink = function () {
      function Drink(stream) {
        _classCallCheck(this, Drink);

        this.stream = stream;
      }

      _createClass(Drink, [{
        key: "ready",
        value: function ready(pane, spec) {
          var $e, src;
          src = "img/drink/DrinkReady.jpg";
          $e = $("<div " + Jitter.rel(0, 0, 100, 100) + "></div>");
          $e.append("<h1 " + Jitter.abs(0, 0, 100, 10) + ">" + spec.name + "</h1>");
          $e.append("  " + Jitter.abi(0, 10, 100, 90, src, 150));
          pane.$.append($e);
        }
      }, {
        key: "create",
        value: function create(pane, spec) {
          var $e, i, j, len, len1, ref, ref1, x, y;
          $e = $("<div   " + Jitter.rel(0, 0, 100, 100) + "></div>");
          $e.append("<h1 " + Jitter.abs(0, 0, 100, 10) + ">" + spec.name + "</h1>");
          ref = [10, 55];
          for (i = 0, len = ref.length; i < len; i++) {
            y = ref[i];
            ref1 = [0, 33, 66];
            for (j = 0, len1 = ref1.length; j < len1; j++) {
              x = ref1[j];
              $e.append("<div " + Jitter.abs(x, y, 33, 45) + ">" + x + "</div>");
            }
          }
          pane.$.append($e);
        }
      }]);

      return Drink;
    }();

    ;

    Jitter.Drink = Drink;

    return Drink;
  }.call(this);
}).call(undefined);
