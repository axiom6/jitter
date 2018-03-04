'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function () {
  //$   = require( 'jquery'      )
  //UI  = require( 'js/ui/UI'    )
  var Pane;

  Pane = function () {
    var Pane = function () {
      function Pane(ui, stream, view, spec) {
        _classCallCheck(this, Pane);

        var i, j, m, n;
        this.animateCall = this.animateCall.bind(this);
        this.ui = ui;
        this.stream = stream;
        this.view = view;
        this.spec = spec;
        this.spec.pane = this;
        this.cells = this.spec.cells;

        var _UI$jmin = UI.jmin(this.cells);

        var _UI$jmin2 = _slicedToArray(_UI$jmin, 4);

        j = _UI$jmin2[0];
        m = _UI$jmin2[1];
        i = _UI$jmin2[2];
        n = _UI$jmin2[3];

        var _view$position = this.view.position(j, m, i, n, this.spec);

        var _view$position2 = _slicedToArray(_view$position, 4);

        this.left = _view$position2[0];
        this.top = _view$position2[1];
        this.width = _view$position2[2];
        this.height = _view$position2[3];

        this.name = this.spec.name;
        this.css = Util.isStr(this.spec.css) ? this.spec.css : 'ikw-pane';
        this.$ = UI.$empty;
        this.wscale = this.view.wscale;
        this.hscale = this.view.hscale;
        this.margin = this.view.margin;
        this.speed = this.view.speed;
        this.page = null; // set by UI.Page.ready()
        this.geo = null; // reset by geom() when pageContent() dispatches to page
      }

      _createClass(Pane, [{
        key: 'ready',
        value: function ready() {
          var select;
          this.htmlId = this.ui.htmlId(this.name, 'Pane');
          this.$ = $(this.createHtml());
          this.view.$view.append(this.$);
          this.hide();
          this.adjacentPanes();
          select = UI.select(this.name, 'Pane', UI.SelectOverview);
          this.reset(select);
          return this.show();
        }
      }, {
        key: 'geom',
        value: function geom() {
          var ex, geo, h, hi, hp, hv, i, j, m, n, r, s, sx, sy, w, wi, wp, wv, x0, y0;

          var _UI$jmin3 = UI.jmin(this.spec.cells);

          var _UI$jmin4 = _slicedToArray(_UI$jmin3, 4);

          j = _UI$jmin4[0];
          m = _UI$jmin4[1];
          i = _UI$jmin4[2];
          n = _UI$jmin4[3];

          // Pane size in AllPage usually 3x3 View
          var _view$positionpx = this.view.positionpx(j, m, i, n, this.spec);

          var _view$positionpx2 = _slicedToArray(_view$positionpx, 2);

          wp = _view$positionpx2[0];
          hp = _view$positionpx2[1];
          wi = this.$.innerWidth();
          hi = this.$.innerHeight();
          w = Math.max(wi, wp); // wp from positionpx
          h = Math.max(hi, hp); // hp from positionpx
          wv = this.view.wPanes();
          hv = this.view.hPanes();
          r = Math.min(w, h) * 0.2; // Use for hexagons
          x0 = w * 0.5;
          y0 = h * 0.5;
          sx = w / wp;
          sy = h / hp;
          s = Math.min(sx, sy);
          ex = wv * 0.9 < w && w < wv * 1.1;
          geo = {
            w: w,
            h: h,
            wi: wi,
            hi: hi,
            wp: wp,
            hp: hp,
            wv: wv,
            hv: hv,
            r: r,
            x0: x0,
            y0: y0,
            sx: sx,
            sy: sy,
            s: s,
            ex: ex
          };
          //Util.log( 'Pane.geom()', geo )
          return geo;
        }
      }, {
        key: 'show',
        value: function show() {
          return this.$.show();
        }
      }, {
        key: 'hide',
        value: function hide() {
          return this.$.hide();
        }
      }, {
        key: 'pc',
        value: function pc(v) {
          return this.view.pc(v);
        }
      }, {
        key: 'xs',
        value: function xs(x) {
          return this.view.xs(x);
        }
      }, {
        key: 'ys',
        value: function ys(y) {
          return this.view.ys(y);
        }
      }, {
        key: 'xcenter',
        value: function xcenter(left, width, w) {
          var scale = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1.0;
          var dx = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;

          return scale * (left + 0.5 * width - 11 + dx / this.wscale);
        }
      }, {
        key: 'xcente2',
        value: function xcente2(left, width, w) {
          var scale = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1.0;
          var dx = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;

          return scale * (left + 0.5 * width - 0.5 * w / this.wscale + dx / this.wscale);
        }
      }, {
        key: 'ycenter',
        value: function ycenter(top, height, h) {
          var scale = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1.0;
          var dy = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;

          return scale * (top + 0.5 * height - 0.5 * h / this.hscale + dy / this.hscale);
        }
      }, {
        key: 'right',
        value: function right(left, width, w) {
          var scale = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1.0;
          var dx = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;

          return scale * (left + width - 0.5 * w / this.wscale + dx / this.wscale);
        }
      }, {
        key: 'bottom',
        value: function bottom(top, height, h) {
          var scale = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1.0;
          var dy = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;

          return scale * (top + height - 0.5 * h / this.hscale + dy / this.hscale);
        }
      }, {
        key: 'north',
        value: function north(top, height, h) {
          var scale = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1.0;
          var dy = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;

          return scale * (top - h + dy / this.hscale);
        }
      }, {
        key: 'south',
        value: function south(top, height, h) {
          var scale = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1.0;
          var dy = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;

          return scale * (top + height + dy / this.hscale);
        }
      }, {
        key: 'east',
        value: function east(left, width, w) {
          var scale = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1.0;
          var dx = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;

          return scale * (left + width + dx / this.wscale);
        }
      }, {
        key: 'west',
        value: function west(left, width, w) {
          var scale = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1.0;
          var dx = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;

          return scale * (left - w + dx / this.wscale);
        }
      }, {
        key: 'adjacentPanes',
        value: function adjacentPanes() {
          var i, ip, j, jp, k, len, m, mp, n, np, pane, ref;

          var _UI$jmin5 = UI.jmin(this.cells);

          var _UI$jmin6 = _slicedToArray(_UI$jmin5, 4);

          jp = _UI$jmin6[0];
          mp = _UI$jmin6[1];
          ip = _UI$jmin6[2];
          np = _UI$jmin6[3];
          var _ref = [this.view.emptyPane, this.view.emptyPane, this.view.emptyPane, this.view.emptyPane];
          this.northPane = _ref[0];
          this.southPane = _ref[1];
          this.eastPane = _ref[2];
          this.westPane = _ref[3];

          ref = this.view.panes;
          for (k = 0, len = ref.length; k < len; k++) {
            pane = ref[k];

            var _UI$jmin7 = UI.jmin(pane.cells);

            var _UI$jmin8 = _slicedToArray(_UI$jmin7, 4);

            j = _UI$jmin8[0];
            m = _UI$jmin8[1];
            i = _UI$jmin8[2];
            n = _UI$jmin8[3];

            if (j === jp && m === mp && i === ip - n) {
              this.northPane = pane;
            }
            if (j === jp && m === mp && i === ip + np) {
              this.southPane = pane;
            }
            if (i === ip && n === np && j === jp - m) {
              this.westPane = pane;
            }
            if (i === ip && n === np && j === jp + mp) {
              this.eastPane = pane;
            }
          }
        }
      }, {
        key: 'createHtml',
        value: function createHtml() {
          return '<div id="' + this.htmlId + '" class="' + this.css + '"></div>';
        }
      }, {
        key: 'reset',
        value: function reset(select) {
          this.$.css({
            left: this.xs(this.left),
            top: this.ys(this.top),
            width: this.xs(this.width),
            height: this.ys(this.height)
          });
          this.pageContent(select);
        }
      }, {
        key: 'css',
        value: function css(left, top, width, height, select) {
          this.$.css({
            left: this.pc(left),
            top: this.pc(top),
            width: this.pc(width),
            height: this.pc(height)
          });
          this.pageContent(select);
        }
      }, {
        key: 'animate',
        value: function animate(left, top, width, height, select) {
          var _this = this;

          var aniLinks = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : false;
          var callback = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : null;

          this.$.show().animate({
            left: this.pc(left),
            top: this.pc(top),
            width: this.pc(width),
            height: this.pc(height)
          }, this.view.speed, function () {
            return _this.animateCall(callback, select);
          });
        }
      }, {
        key: 'animateCall',
        value: function animateCall(callback, select) {
          this.pageContent(select);
          if (callback != null) {
            callback(this);
          }
        }
      }, {
        key: 'pageContent',
        value: function pageContent(select) {
          this.geo = this.geom();
          if (this.page != null) {
            this.page.onSelect(this, select);
          }
        }
      }]);

      return Pane;
    }();

    ;

    //module.exports = Pane
    UI.Pane = Pane;

    return Pane;
  }.call(this);
}).call(undefined);
