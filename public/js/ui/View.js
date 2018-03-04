"use strict";

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function () {
  //$  = require('jquery')
  //UI = require( 'js/ui/UI' )
  var View,
      hasProp = {}.hasOwnProperty;

  View = function () {
    var View = function () {
      function View(ui, stream, practices1) {
        _classCallCheck(this, View);

        this.resize = this.resize.bind(this);
        this.ui = ui;
        this.stream = stream;
        this.practices = practices1;
        this.speed = 400;
        this.$view = UI.$empty;
        this.margin = UI.margin;
        this.ncol = UI.ncol;
        this.nrow = UI.nrow;

        var _percents = this.percents(this.nrow, this.ncol, this.margin);

        var _percents2 = _slicedToArray(_percents, 6);

        this.wpane = _percents2[0];
        this.hpane = _percents2[1];
        this.wview = _percents2[2];
        this.hview = _percents2[3];
        this.wscale = _percents2[4];
        this.hscale = _percents2[5];

        this.panes = this.createPanes(this.practices);
        this.sizeCallback = null;
        this.paneCallback = null;
        this.lastPaneName = '';
        this.emptyPane = UI.$empty;
        this.allCells = [1, this.ncol, 1, this.nrow];
        this.select = UI.select("Overview", "View", UI.SelectOverview);
      }

      _createClass(View, [{
        key: "ready",
        value: function ready() {
          var html, htmlId, k, len, pane, parent, ref;
          parent = $('#' + this.ui.getHtmlId('View')); // parent is outside of planes
          htmlId = this.ui.htmlId('View', 'Plane');
          html = $("<div id=\"" + htmlId + "\" class=\"ikw-view-plane\"></div>");
          parent.append(html);
          this.$view = parent.find('#' + htmlId);
          ref = this.panes;
          for (k = 0, len = ref.length; k < len; k++) {
            pane = ref[k];
            pane.ready();
          }
          this.subscribe();
        }
      }, {
        key: "subscribe",
        value: function subscribe() {
          var _this = this;

          return this.stream.subscribe('Select', function (select) {
            return _this.onSelect(select);
          });
        }
      }, {
        key: "percents",
        value: function percents(nrow, ncol, margin) {
          var hpane, hscale, hview, wpane, wscale, wview;
          wpane = 100 / ncol;
          hpane = 100 / nrow;
          wview = 1.0 - (margin.west + margin.east) / 100;
          hview = 1.0 - (margin.north + margin.south) / 100;
          wscale = 1.0 - (margin.west + (ncol - 1) * margin.width + margin.east) / 100; // Scaling factor for panes once all
          hscale = 1.0 - (margin.north + (nrow - 1) * margin.height + margin.south) / 100; // margins gutters are accounted for
          return [wpane, hpane, wview, hview, wscale, hscale];
        }
      }, {
        key: "pc",
        value: function pc(v) {
          return v.toString() + (v !== 0 ? '%' : '');
        }
      }, {
        key: "xs",
        value: function xs(x) {
          return this.pc(x * this.wscale);
        }
      }, {
        key: "ys",
        value: function ys(y) {
          return this.pc(y * this.hscale);
        }
      }, {
        key: "left",
        value: function left(j) {
          return j * this.wpane;
        }
      }, {
        key: "top",
        value: function top(i) {
          return i * this.hpane;
        }
      }, {
        key: "width",
        value: function width(m) {
          return m * this.wpane + (m - 1) * this.margin.width / this.wscale;
        }
      }, {
        key: "height",
        value: function height(n) {
          return n * this.hpane + (n - 1) * this.margin.height / this.hscale;
        }
      }, {
        key: "widthpx",
        value: function widthpx() {
          return this.$view.innerWidth(); // Use @viewp because
        }
      }, {
        key: "heightpx",
        value: function heightpx() {
          return this.$view.innerHeight(); // Use @viewp because @$view
        }
      }, {
        key: "wPanes",
        value: function wPanes() {
          return this.wview * this.widthpx();
        }
      }, {
        key: "hPanes",
        value: function hPanes() {
          return this.hview * this.heightpx();
        }
      }, {
        key: "north",
        value: function north(top, height, h) {
          var scale = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1.0;
          var dy = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;

          return scale * (top - h + dy / this.hscale);
        }
      }, {
        key: "south",
        value: function south(top, height, h) {
          var scale = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1.0;
          var dy = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;

          return scale * (top + height + dy / this.hscale);
        }
      }, {
        key: "east",
        value: function east(left, width, w) {
          var scale = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1.0;
          var dx = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;

          return scale * (left + width + dx / this.wscale);
        }
      }, {
        key: "west",
        value: function west(left, width, w) {
          var scale = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1.0;
          var dx = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;

          return scale * (left - w + dx / this.wscale);
        }
      }, {
        key: "isRow",
        value: function isRow(specPaneGroup) {
          return specPaneGroup.css === 'ikw-row';
        }
      }, {
        key: "isCol",
        value: function isCol(specPaneGroup) {
          return specPaneGroup.css === 'ikw-col';
        }
      }, {
        key: "jmin",
        value: function jmin(cells) {
          return UI.jmin(cells);
        }
      }, {
        key: "positionUnionPane",
        value: function positionUnionPane(unionCells, paneCells, spec) {
          var xscale = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1.0;
          var yscale = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 1.0;

          var ip, iu, jp, ju, mp, mu, np, nu;

          var _UI$jmin = UI.jmin(unionCells);

          var _UI$jmin2 = _slicedToArray(_UI$jmin, 4);

          ju = _UI$jmin2[0];
          mu = _UI$jmin2[1];
          iu = _UI$jmin2[2];
          nu = _UI$jmin2[3];

          var _UI$jmin3 = UI.jmin(paneCells);

          var _UI$jmin4 = _slicedToArray(_UI$jmin3, 4);

          jp = _UI$jmin4[0];
          mp = _UI$jmin4[1];
          ip = _UI$jmin4[2];
          np = _UI$jmin4[3];

          return this.position((jp - ju) * this.ncol / mu, mp * this.ncol / mu, (ip - iu) * this.nrow / nu, np * this.nrow / nu, spec, xscale, yscale);
        }
      }, {
        key: "positionGroup",
        value: function positionGroup(groupCells, spec) {
          var xscale = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1.0;
          var yscale = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1.0;

          var i, j, m, n;

          var _UI$jmin5 = UI.jmin(groupCells);

          var _UI$jmin6 = _slicedToArray(_UI$jmin5, 4);

          j = _UI$jmin6[0];
          m = _UI$jmin6[1];
          i = _UI$jmin6[2];
          n = _UI$jmin6[3];

          return this.position(j, m, i, n, spec, xscale, yscale);
        }
      }, {
        key: "position",
        value: function position(j, m, i, n, spec) {
          var xscale = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 1.0;
          var yscale = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : 1.0;

          var hStudy, height, left, top, wStudy, width;
          //Util.log('UI.View.position spec', spec.name,  )
          wStudy = spec.name != null ? this.margin.wStudy : 0;
          hStudy = spec.name != null ? this.margin.hStudy : 0;
          left = xscale * (this.left(j) + (wStudy + this.margin.west + j * this.margin.width) / this.wscale);
          top = yscale * (this.top(i) + (hStudy + this.margin.north + i * this.margin.height) / this.hscale);
          width = xscale * (this.width(m) - wStudy * 2 / this.wscale);
          height = yscale * (this.height(n) - hStudy * 2 / this.hscale);
          return [left, top, width, height];
        }
      }, {
        key: "positionpx",
        value: function positionpx(j, m, i, n, spec) {
          var height, left, top, width;

          var _position = this.position(j, m, i, n, spec, this.wscale, this.hscale);

          var _position2 = _slicedToArray(_position, 4);

          left = _position2[0];
          top = _position2[1];
          width = _position2[2];
          height = _position2[3];

          return [width * this.widthpx() / 100, height * this.heightpx() / 100];
        }
      }, {
        key: "reset",
        value: function reset(select) {
          var k, len, pane, ref;
          this.select.name = select.name;
          this.select.intent = select.intent;
          ref = this.panes;
          for (k = 0, len = ref.length; k < len; k++) {
            pane = ref[k];
            pane.reset(this.select);
          }
        }
      }, {
        key: "resize",
        value: function resize() {
          var saveId;
          saveId = this.lastPaneName;
          this.lastPaneName = '';
          this.onSelect(UI.select(saveId, 'View', UI.SelectPractice));
          this.lastPaneName = saveId;
        }
      }, {
        key: "hide",
        value: function hide() {
          this.$view.hide();
        }
      }, {
        key: "show",
        value: function show() {
          if (this.inPlane()) {
            this.$view.show();
          }
        }
      }, {
        key: "hideAll",
        value: function hideAll() {
          var k, len, pane, ref;
          ref = this.panes;
          for (k = 0, len = ref.length; k < len; k++) {
            pane = ref[k];
            pane.hide();
          }
          this.$view.hide();
        }
      }, {
        key: "showAll",
        value: function showAll() {
          var _this2 = this;

          var k, len, pane, ref;
          if (!this.inPlane()) {
            return;
          }
          this.$view.hide();
          this.reset(this.select);
          ref = this.panes;
          for (k = 0, len = ref.length; k < len; k++) {
            pane = ref[k];
            pane.show();
          }
          this.$view.show(this.speed, function () {
            if (_this2.sizeCallback) {
              return _this2.sizeCallback(_this2);
            }
          });
        }
      }, {
        key: "onSelect",
        value: function onSelect(select) {
          var intent, name;
          UI.verifySelect(select, 'View');
          if (this.ui.notInPlane()) {
            return;
          }
          name = select.name;
          intent = select.intent;
          this.select = select;
          switch (intent) {
            case UI.SelectOverview:
              this.expandAllPanes();
              break;
            case UI.SelectPractice:
              this.expandPane(this.getPaneOrGroup(name));
              break;
            case UI.SelectStudy:
              this.expandPane(this.getPaneOrGroup(name));
              break;
            default:
              Util.error('UI.View.onSelect() name not processed for intent', name, select.intent);
          }
        }
      }, {
        key: "inPlane",
        value: function inPlane() {
          return true;
        }
      }, {
        key: "expandAllPanes",
        value: function expandAllPanes() {
          this.hideAll();
          this.reset(this.select);
          return this.showAll();
        }
      }, {
        key: "expandPane",
        value: function expandPane(pane) {
          var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
          // , study=null
          var paneCallback;
          paneCallback = callback != null ? callback : this.paneCallback;
          pane = this.getPaneOrGroup(pane, false); // don't issue errors
          if (pane == null) {
            return;
          }
          this.hideAll();
          pane.show();
          pane.animate(this.margin.west, this.margin.north, 100 * this.wview, 100 * this.hview, this.select, true, paneCallback);
          this.show();
          this.lastPaneName = pane.name;
        }
      }, {
        key: "getPaneOrGroup",
        value: function getPaneOrGroup(keyOrPane) {
          var issueError = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

          var group, k, key, l, len, len1, pane, ref, ref1;
          if (keyOrPane == null || Util.isObj(keyOrPane)) {
            return keyOrPane;
          }
          key = keyOrPane;
          ref = this.panes;
          for (k = 0, len = ref.length; k < len; k++) {
            pane = ref[k];
            if (pane.name === key) {
              return pane;
            }
          }
          if (this.groups != null) {
            ref1 = this.groups;
            for (l = 0, len1 = ref1.length; l < len1; l++) {
              group = ref1[l];
              if (group.name === key) {
                return group;
              }
            }
          }
          if (issueError) {
            Util.error('UI.View.getPaneOrGroup() null for key ', key);
          }
          return this.emptyPane;
        }
      }, {
        key: "createPanes",
        value: function createPanes(practices) {
          var keyPractice, pane, panes, practice;
          panes = [];
          for (keyPractice in practices) {
            if (!hasProp.call(practices, keyPractice)) continue;
            practice = practices[keyPractice];
            if (!(keyPractice !== 'Overview' && practice.cells != null)) {
              continue;
            }
            pane = new UI.Pane(this.ui, this.stream, this, practice);
            panes.push(pane);
            practice.pane = pane;
          }
          // @createStudyPanes( practice, panes )
          return panes;
        }
      }, {
        key: "paneInUnion",
        value: function paneInUnion(paneCells, unionCells) {
          var ip, iu, jp, ju, mp, mu, np, nu;

          var _UI$jmin7 = UI.jmin(paneCells);

          var _UI$jmin8 = _slicedToArray(_UI$jmin7, 4);

          jp = _UI$jmin8[0];
          mp = _UI$jmin8[1];
          ip = _UI$jmin8[2];
          np = _UI$jmin8[3];

          var _UI$jmin9 = UI.jmin(unionCells);

          var _UI$jmin10 = _slicedToArray(_UI$jmin9, 4);

          ju = _UI$jmin10[0];
          mu = _UI$jmin10[1];
          iu = _UI$jmin10[2];
          nu = _UI$jmin10[3];

          return ju <= jp && jp + mp <= ju + mu && iu <= ip && ip + np <= iu + nu;
        }
      }, {
        key: "expandCells",
        value: function expandCells(unionCells, allCells) {
          // Not Implemented
          var ia, iu, ja, ju, ma, mu, na, nu;

          var _UI$jmin11 = UI.jmin(unionCells);

          var _UI$jmin12 = _slicedToArray(_UI$jmin11, 4);

          ju = _UI$jmin12[0];
          mu = _UI$jmin12[1];
          iu = _UI$jmin12[2];
          nu = _UI$jmin12[3];

          var _UI$jmin13 = UI.jmin(allCells);

          var _UI$jmin14 = _slicedToArray(_UI$jmin13, 4);

          ja = _UI$jmin14[0];
          ma = _UI$jmin14[1];
          ia = _UI$jmin14[2];
          na = _UI$jmin14[3];

          return [(ju - ja) * ma / mu, ma, (iu - ia) * na / nu, na];
        }
      }]);

      return View;
    }();

    ;

    //module.exports = View
    UI.View = View;

    return View;
  }.call(this);
}).call(undefined);
