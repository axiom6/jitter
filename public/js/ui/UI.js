'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// $ = require('jquery')
var UI;

UI = function () {
  var UI = function () {
    function UI(stream, page) {
      var _this = this;

      _classCallCheck(this, UI);

      var callback;
      this.resize = this.resize.bind(this);
      this.stream = stream;
      this.page = page;
      callback = function callback(data) {
        _this.spec = data;
        _this.tocs = new UI.Tocs(_this, _this.stream, _this.spec);
        _this.view = new UI.View(_this, _this.stream, _this.spec);
        return _this.ready(_this.page, _this.spec);
      };
      UI.readJSON("json/toc.json", callback);
      UI.ui = this;
    }

    _createClass(UI, [{
      key: 'ready',
      value: function ready(page, spec) {
        this.page = page;
        this.spec = spec;
        $('#' + Util.htmlId('App')).html(this.html());
        this.tocs.ready();
        this.view.ready();
        this.page.ready(this.view, this.spec);
      }
    }, {
      key: 'html',
      value: function html() {
        return '<div   class="ikw-logo" id="' + this.htmlId('Logo') + '"></div>\n<div   class="ikw-corp" id="' + this.htmlId('Corp') + '">\n  <div id="' + this.htmlId('Navb') + '"></div>\n</div>\n<div   class="ikw-find" id="' + this.htmlId('Find') + '"></div>\n<div   class="ikw-tocs tocs" id="' + this.htmlId('Tocs') + '"></div>\n<div   class="ikw-view" id="' + this.htmlId('View') + '">\n  <i id="' + this.htmlId('Togg') + '" class="fa fa-compress ikw-togg"></i>\n</div>\n<div class="ikw-side" id="' + this.htmlId('Side') + '"></div>\n<div class="ikw-pref" id="' + this.htmlId('Pref') + '"><a id="' + this.htmlId('ImageLink') + '"></a></div>\n<div class="ikw-foot" id="' + this.htmlId('Foot') + '"></div>\n<div class="ikw-trak" id="' + this.htmlId('Trak') + '"></div>';
      }
    }, {
      key: 'show',
      value: function show() {
        this.tocs.show();
        this.view.showAll();
      }
    }, {
      key: 'hide',
      value: function hide() {
        this.tocs.hide();
        this.view.hideAll();
      }
    }, {
      key: 'resize',
      value: function resize() {
        this.view.resize();
      }
    }, {
      key: 'htmlId',
      value: function htmlId(name) {
        var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
        var ext = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';

        return Util.htmlId(name, type, ext);
      }
    }, {
      key: 'notInPlane',
      value: function notInPlane() {
        return false;
      }
    }, {
      key: 'getHtmlId',
      value: function getHtmlId(name) {
        var ext = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

        return Util.getHtmlId(name, "", ext);
      }
    }], [{
      key: 'baseUrl',
      value: function baseUrl(isLocal) {
        if (isLocal) {
          return "http://localhost:63342/jitter/public/";
        } else {
          return "https://jitter-48413.firebaseapp.com/";
        }
      }
    }, {
      key: 'readJSON',
      value: function readJSON(url, callback) {
        var settings, urlLocal;
        urlLocal = "http://localhost:63342/jitter/public/" + url;
        settings = {
          url: urlLocal,
          type: 'GET',
          dataType: 'json',
          processData: false,
          contentType: 'application/json',
          accepts: 'application/json'
        };
        settings.success = function (data, status, jqXHR) {
          Util.noop(status, jqXHR);
          return callback(data);
        };
        settings.error = function (jqXHR, status, error) {
          Util.noop(jqXHR);
          return Util.error("UI.readJSON()", {
            url: urlLocal,
            status: status,
            error: error
          });
        };
        $.ajax(settings);
      }
    }, {
      key: 'isChild',
      value: function isChild(key) {
        var a;
        a = key.charAt(0);
        return a === a.toUpperCase() && a !== '$';
      }
    }, {
      key: 'select',
      value: function select(name, source, intent) {
        var obj;
        obj = {
          name: name,
          source: source,
          intent: intent
        };
        UI.verifySelect(obj);
        return obj;
      }
    }, {
      key: 'verifySelect',
      value: function verifySelect(select, source) {
        var verify;
        verify = Util.isStr(select.name) && Util.isStr(select.source) && Util.inArray(UI.intents, select.intent);
        if (!verify) {
          Util.trace('UI.verifySelect()', select, source);
        }
        return verify;
      }

      /*
      Error: Page.selectContent() unknown select { name:"", source:Tocs, intent:undefined }
      Error: UI.Tocs.getSpec(id) spec null for select { name:"", source:Tocs, intent:undefined }
      Error: UI.View.onSelect() name not processed for intent "" undefined
      */

    }, {
      key: 'isEmpty',
      value: function isEmpty($elem) {
        return $elem != null && $elem.length != null && $elem.length === 0;
      }
    }, {
      key: 'isElem',
      value: function isElem($elem) {
        return !UI.isEmpty($elem);
      }
    }, {
      key: 'jmin',
      value: function jmin(cells) {
        if (cells == null) {
          Util.trace('UI.jmin');
        }
        return [cells[0] - 1, cells[1], cells[2] - 1, cells[3]];
      }
    }, {
      key: 'toCells',
      value: function toCells(jmin) {
        return [jmin[0] + 1, jmin[1], jmin[2] + 1, jmin[3]];
      }
    }, {
      key: 'unionCells',
      value: function unionCells(cells1, cells2) {
        var i1, i2, j1, j2, m1, m2, n1, n2;

        var _UI$jmin = UI.jmin(cells1);

        var _UI$jmin2 = _slicedToArray(_UI$jmin, 4);

        j1 = _UI$jmin2[0];
        m1 = _UI$jmin2[1];
        i1 = _UI$jmin2[2];
        n1 = _UI$jmin2[3];

        var _UI$jmin3 = UI.jmin(cells2);

        var _UI$jmin4 = _slicedToArray(_UI$jmin3, 4);

        j2 = _UI$jmin4[0];
        m2 = _UI$jmin4[1];
        i2 = _UI$jmin4[2];
        n2 = _UI$jmin4[3];

        return [Math.min(j1, j2) + 1, Math.max(j1 + m1, j2 + m2) - Math.min(j1, j2), Math.min(i1, i2) + 1, Math.max(i1 + n1, i2 + n2) - Math.min(i1, i2)];
      }
    }, {
      key: 'intersectCells',
      value: function intersectCells(cells1, cells2) {
        var i1, i2, j1, j2, m1, m2, n1, n2;

        var _UI$jmin5 = UI.jmin(cells1);

        var _UI$jmin6 = _slicedToArray(_UI$jmin5, 4);

        j1 = _UI$jmin6[0];
        m1 = _UI$jmin6[1];
        i1 = _UI$jmin6[2];
        n1 = _UI$jmin6[3];

        var _UI$jmin7 = UI.jmin(cells2);

        var _UI$jmin8 = _slicedToArray(_UI$jmin7, 4);

        j2 = _UI$jmin8[0];
        m2 = _UI$jmin8[1];
        i2 = _UI$jmin8[2];
        n2 = _UI$jmin8[3];

        return [Math.max(j1, j2) + 1, Math.min(j1 + m1, j2 + m2), Math.max(i1, i2) + 1, Math.min(i1 + n1, i2 + n2)];
      }
    }, {
      key: 'subscribe',
      value: function subscribe() {}

      //UI.TheStream.subscribe( 'Plane', (name) => UI.onPlane(name) )  # if not UI.Build? # Subscribe only when ui.ready()
      //UI.TheStream.subscribe( 'Image', (name) => UI.onImage(name) )

    }, {
      key: 'publish',
      value: function publish() {}
    }]);

    return UI;
  }();

  ;

  //Util.UI        = UI
  //module.exports = UI
  //UI.Tocs        = require( 'js/ui/Tocs'    )
  //UI.View        = require( 'js/ui/View'    )
  //UI.Pane        = require( 'js/ui/Pane'    )
  UI.$empty = $(); // Empty jQuery singleton for intialization

  UI.None = "None";

  UI.ncol = 36;

  UI.nrow = 36;

  UI.margin = {
    width: 1,
    height: 1,
    west: 5,
    north: 5,
    east: 2,
    south: 2,
    wStudy: 0.5,
    hStudy: 0.5
  };

  UI.MaxTocLevel = 12;

  UI.SelectOverview = 'SelectOverview';

  UI.SelectPractice = 'SelectPractice';

  UI.SelectStudy = 'SelectStudy';

  UI.intents = [UI.SelectOverview, UI.SelectPractice, UI.SelectStudy];

  return UI;
}.call(undefined);

//UI.TheStream.publish( 'Content', UI.Build.content( 'Studies', 'createUI', Build.SelectAllPanes ) )
