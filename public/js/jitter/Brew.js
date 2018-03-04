"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function () {
  var Brew,
      hasProp = {}.hasOwnProperty;

  Brew = function () {
    var Brew = function () {
      function Brew(stream) {
        _classCallCheck(this, Brew);

        this.stream = stream;
      }

      _createClass(Brew, [{
        key: "ready",
        value: function ready(pane, spec) {
          var $e, src;
          src = "img/brew/" + spec['AutoDrip'].icon;
          $e = $("<div " + Jitter.rel(0, 0, 100, 100) + "></div>");
          $e.append("<h1 " + Jitter.abs(0, 0, 100, 10) + ">" + spec.name + "</h1>");
          $e.append("  " + Jitter.abi(0, 10, 100, 90, src, 150));
          pane.$.append($e);
        }
      }, {
        key: "create",
        value: function create(pane, spec) {
          /*
          $e.append( """<div     #{Jitter.abs(x,y,w,h)}>
                                 #{Jitter.img(src)}
                            <div #{Jitter.txt()}>#{brew.name}</div>
                        </div>""" )
           */
          var $e, brew, h, i, key, src, w, x, y;
          pane.$.append("<h1>Brew</h1>");
          $e = $("<div " + Jitter.rel(0, 0, 100, 100) + "></div>");
          i = 1;
          x = 0;
          w = 25;
          h = 25;
          for (key in spec) {
            if (!hasProp.call(spec, key)) continue;
            brew = spec[key];
            if (!UI.isChild(key)) {
              continue;
            }
            src = 'img/brew/' + brew.icon;
            x = i !== 4 ? x + 25 : 0;
            y = i <= 4 ? 10 : 50;
            if (i === 5) {
              x = 12.5;
            }
            $e.append("" + Jitter.abi(x, y, w, h, src, 150, brew.name));
            i = i + 1;
          }
          pane.$.append($e);
        }
      }]);

      return Brew;
    }();

    ;

    Jitter.Brew = Brew;

    return Brew;
  }.call(this);
}).call(undefined);
