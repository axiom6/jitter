'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Jitter;

Jitter = function () {
  function Jitter() {
    _classCallCheck(this, Jitter);
  }

  _createClass(Jitter, null, [{
    key: 'init',

    //module.exports = Jitter
    value: function init() {
      Util.ready(function () {
        var page, stream, subjects, ui;
        subjects = ['Select', 'Content', 'Connect', 'Test', 'Plane', 'About', 'Slide', 'Image', 'Cursor', 'Navigate', 'Settings', 'Submit', 'Toggle'];
        stream = new Util.Stream(subjects);
        page = new Jitter.Page(stream);
        ui = new UI(stream, page);
        Util.noop(ui);
      });
    }
  }, {
    key: 'abs',
    value: function abs(x, y, w, h) {
      return 'style="position:absolute; left:' + x + '%; top:' + y + '%; width:' + w + '%; height:' + h + '%; text-align:center; font-size:24px;" ';
    }
  }, {
    key: 'abi',
    value: function abi(x, y, w, h, src, mh) {
      var label = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : "";

      var htm;
      htm = '<div     style="position:absolute; left:' + x + '%; top:' + y + '%; width:' + w + '%; height:' + h + '%; display:table;">\n<div   style="display:table-cell; vertical-align:middle;">\n  <img style="display:block; margin-left:auto; margin-right:auto; max-height:' + mh + 'px;" src="' + src + '"/>';
      if (Util.isStr(label)) {
        htm += '<div style="color:white; font-size:20px; padding-top:4px;">' + label + '</div>';
      }
      htm += "</div></div>";
      return htm;
    }
  }, {
    key: 'rel',
    value: function rel(x, y, w, h) {
      return 'style="position:relative; left:' + x + '%; top:' + y + '%; width:' + w + '%; height:' + h + '%; text-align:center;" ';
    }
  }, {
    key: 'img',
    value: function img(src) {
      return '<div style="display:table-cell; vertical-align:middle;"><img style="display:block; margin-left:auto; margin-right:auto;" src="' + src + '"/></div>';
    }
  }, {
    key: 'txt',
    value: function txt() {
      return "style=\"color:white; text-align:center;\"  ";
    }
  }]);

  return Jitter;
}();
