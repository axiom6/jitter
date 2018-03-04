"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function () {
  var Flavor;

  Flavor = function () {
    var Flavor = function () {
      function Flavor(stream) {
        _classCallCheck(this, Flavor);

        this.stream = stream;
      }

      _createClass(Flavor, [{
        key: "ready",
        value: function ready(pane, spec) {
          var $e, src;
          src = "img/flavor/FlavorReady.png";
          $e = $("<div " + Jitter.rel(0, 0, 100, 100) + "></div>");
          $e.append("<h1 " + Jitter.abs(0, 0, 100, 10) + ">" + spec.name + "</h1>");
          $e.append("  " + Jitter.abi(0, 10, 100, 90, src, 150));
          pane.$.append($e);
        }
      }, {
        key: "create",
        value: function create(pane, spec) {
          UI.plotId = "FlavorVisual";
          UI.jsonD3 = "json/flavor.jitter.json";
          pane.$.append("<h1>" + spec.name + "</h1>");
          pane.$.append("<div id=\"" + UI.plotId + "\">&nbsp;</div>");
          Util.loadScript("js/wheel/flavor.v3.js");
        }
      }]);

      return Flavor;
    }();

    ;

    Jitter.Flavor = Flavor;

    return Flavor;
  }.call(this);
}).call(undefined);
