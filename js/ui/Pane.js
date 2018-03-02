// Generated by CoffeeScript 1.6.3
(function() {
  var Pane,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  Pane = (function() {
    UI.Pane = Pane;

    function Pane(ui, stream, view, spec) {
      var i, j, m, n, _ref, _ref1;
      this.ui = ui;
      this.stream = stream;
      this.view = view;
      this.spec = spec;
      this.animateCall = __bind(this.animateCall, this);
      this.spec.pane = this;
      this.cells = this.spec.cells;
      _ref = UI.jmin(this.cells), j = _ref[0], m = _ref[1], i = _ref[2], n = _ref[3];
      _ref1 = this.view.position(j, m, i, n, this.spec), this.left = _ref1[0], this.top = _ref1[1], this.width = _ref1[2], this.height = _ref1[3];
      this.name = this.spec.name;
      this.css = Util.isStr(this.spec.css) ? this.spec.css : 'ikw-pane';
      this.$ = UI.$empty;
      this.wscale = this.view.wscale;
      this.hscale = this.view.hscale;
      this.margin = this.view.margin;
      this.speed = this.view.speed;
      this.page = null;
    }

    Pane.prototype.ready = function() {
      this.htmlId = this.ui.htmlId(this.name, 'Pane');
      this.$ = $(this.createHtml());
      this.view.$view.append(this.$);
      this.hide();
      this.adjacentPanes();
      return this.show();
    };

    Pane.prototype.geom = function() {
      var ex, geo, h, hi, hp, hv, i, j, m, n, r, s, sx, sy, w, wi, wp, wv, x0, y0, _ref, _ref1;
      _ref = UI.jmin(this.spec.cells), j = _ref[0], m = _ref[1], i = _ref[2], n = _ref[3];
      _ref1 = this.view.positionpx(j, m, i, n, this.spec), wp = _ref1[0], hp = _ref1[1];
      wi = this.$.innerWidth();
      hi = this.$.innerHeight();
      w = Math.max(wi, wp);
      h = Math.max(hi, hp);
      wv = this.view.wPanes();
      hv = this.view.hPanes();
      r = Math.min(w, h) * 0.2;
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
      return geo;
    };

    Pane.prototype.show = function() {
      return this.$.show();
    };

    Pane.prototype.hide = function() {
      return this.$.hide();
    };

    Pane.prototype.pc = function(v) {
      return this.view.pc(v);
    };

    Pane.prototype.xs = function(x) {
      return this.view.xs(x);
    };

    Pane.prototype.ys = function(y) {
      return this.view.ys(y);
    };

    Pane.prototype.xcenter = function(left, width, w, scale, dx) {
      if (scale == null) {
        scale = 1.0;
      }
      if (dx == null) {
        dx = 0;
      }
      return scale * (left + 0.5 * width - 11 + dx / this.wscale);
    };

    Pane.prototype.xcente2 = function(left, width, w, scale, dx) {
      if (scale == null) {
        scale = 1.0;
      }
      if (dx == null) {
        dx = 0;
      }
      return scale * (left + 0.5 * width - 0.5 * w / this.wscale + dx / this.wscale);
    };

    Pane.prototype.ycenter = function(top, height, h, scale, dy) {
      if (scale == null) {
        scale = 1.0;
      }
      if (dy == null) {
        dy = 0;
      }
      return scale * (top + 0.5 * height - 0.5 * h / this.hscale + dy / this.hscale);
    };

    Pane.prototype.right = function(left, width, w, scale, dx) {
      if (scale == null) {
        scale = 1.0;
      }
      if (dx == null) {
        dx = 0;
      }
      return scale * (left + width - 0.5 * w / this.wscale + dx / this.wscale);
    };

    Pane.prototype.bottom = function(top, height, h, scale, dy) {
      if (scale == null) {
        scale = 1.0;
      }
      if (dy == null) {
        dy = 0;
      }
      return scale * (top + height - 0.5 * h / this.hscale + dy / this.hscale);
    };

    Pane.prototype.north = function(top, height, h, scale, dy) {
      if (scale == null) {
        scale = 1.0;
      }
      if (dy == null) {
        dy = 0;
      }
      return scale * (top - h + dy / this.hscale);
    };

    Pane.prototype.south = function(top, height, h, scale, dy) {
      if (scale == null) {
        scale = 1.0;
      }
      if (dy == null) {
        dy = 0;
      }
      return scale * (top + height + dy / this.hscale);
    };

    Pane.prototype.east = function(left, width, w, scale, dx) {
      if (scale == null) {
        scale = 1.0;
      }
      if (dx == null) {
        dx = 0;
      }
      return scale * (left + width + dx / this.wscale);
    };

    Pane.prototype.west = function(left, width, w, scale, dx) {
      if (scale == null) {
        scale = 1.0;
      }
      if (dx == null) {
        dx = 0;
      }
      return scale * (left - w + dx / this.wscale);
    };

    Pane.prototype.adjacentPanes = function() {
      var i, ip, j, jp, m, mp, n, np, pane, _i, _len, _ref, _ref1, _ref2, _ref3;
      _ref = UI.jmin(this.cells), jp = _ref[0], mp = _ref[1], ip = _ref[2], np = _ref[3];
      _ref1 = [this.view.emptyPane, this.view.emptyPane, this.view.emptyPane, this.view.emptyPane], this.northPane = _ref1[0], this.southPane = _ref1[1], this.eastPane = _ref1[2], this.westPane = _ref1[3];
      _ref2 = this.view.panes;
      for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
        pane = _ref2[_i];
        _ref3 = UI.jmin(pane.cells), j = _ref3[0], m = _ref3[1], i = _ref3[2], n = _ref3[3];
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
    };

    Pane.prototype.createHtml = function() {
      return "<div id=\"" + this.htmlId + "\" class=\"" + this.css + "\"></div>";
    };

    Pane.prototype.reset = function(select) {
      this.$.css({
        left: this.xs(this.left),
        top: this.ys(this.top),
        width: this.xs(this.width),
        height: this.ys(this.height)
      });
      this.pageContent(select);
    };

    Pane.prototype.css = function(left, top, width, height, select) {
      this.$.css({
        left: this.pc(left),
        top: this.pc(top),
        width: this.pc(width),
        height: this.pc(height)
      });
      this.pageContent(select);
    };

    Pane.prototype.animate = function(left, top, width, height, select, aniLinks, callback) {
      var _this = this;
      if (aniLinks == null) {
        aniLinks = false;
      }
      if (callback == null) {
        callback = null;
      }
      this.$.show().animate({
        left: this.pc(left),
        top: this.pc(top),
        width: this.pc(width),
        height: this.pc(height)
      }, this.view.speed, function() {
        return _this.animateCall(callback, select);
      });
    };

    Pane.prototype.animateCall = function(callback, select) {
      this.pageContent(select);
      if (callback != null) {
        callback(this);
      }
    };

    Pane.prototype.pageContent = function(select) {
      if (this.page != null) {
        this.page.paneContent(select);
      }
    };

    return Pane;

  })();

}).call(this);
