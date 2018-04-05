var Pane;

import Util from '../util/Util.js';

import UI from '../ui/UI.js';

export default Pane = class Pane {
  constructor(ui, stream, view, spec) {
    var i, j, m, n;
    this.animateCall = this.animateCall.bind(this);
    this.ui = ui;
    this.stream = stream;
    this.view = view;
    this.spec = spec;
    this.spec.pane = this;
    this.cells = this.spec.cells;
    [j, m, i, n] = UI.jmin(this.cells);
    [this.left, this.top, this.width, this.height] = this.view.position(j, m, i, n, this.spec);
    this.name = this.spec.name;
    this.classPrefix = Util.isStr(this.spec.css) ? this.spec.css : 'ui-pane';
    this.$ = UI.$empty;
    this.wscale = this.view.wscale;
    this.hscale = this.view.hscale;
    this.margin = this.view.margin;
    this.speed = this.view.speed;
    this.page = null; // set by UI.Page.ready()
    this.geo = null; // reset by geom() when onSelect() dispatches to page
  }

  ready() {
    var select;
    this.htmlId = UI.htmlId(this.name, 'Pane');
    this.$ = $(this.createHtml());
    this.view.$view.append(this.$);
    this.hide();
    this.adjacentPanes();
    select = UI.select(this.name, 'Pane', UI.SelectPane);
    this.reset(select);
    return this.show();
  }

  geom() {
    var ex, geo, h, hi, hp, hv, i, j, m, n, r, s, sx, sy, w, wi, wp, wv, x0, y0;
    [j, m, i, n] = UI.jmin(this.spec.cells);
    [wp, hp] = this.view.positionpx(j, m, i, n, this.spec); // Pane size in AllPage usually 3x3 View
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
    //console.log( 'Pane.geom()', geo )
    return geo;
  }

  show() {
    return this.$.show();
  }

  hide() {
    return this.$.hide();
  }

  pc(v) {
    return this.view.pc(v);
  }

  xs(x) {
    return this.view.xs(x);
  }

  ys(y) {
    return this.view.ys(y);
  }

  xcenter(left, width, w, scale = 1.0, dx = 0) {
    return scale * (left + 0.5 * width - 11 + dx / this.wscale);
  }

  xcente2(left, width, w, scale = 1.0, dx = 0) {
    return scale * (left + 0.5 * width - 0.5 * w / this.wscale + dx / this.wscale);
  }

  ycenter(top, height, h, scale = 1.0, dy = 0) {
    return scale * (top + 0.5 * height - 0.5 * h / this.hscale + dy / this.hscale);
  }

  right(left, width, w, scale = 1.0, dx = 0) {
    return scale * (left + width - 0.5 * w / this.wscale + dx / this.wscale);
  }

  bottom(top, height, h, scale = 1.0, dy = 0) {
    return scale * (top + height - 0.5 * h / this.hscale + dy / this.hscale);
  }

  north(top, height, h, scale = 1.0, dy = 0) {
    return scale * (top - h + dy / this.hscale);
  }

  south(top, height, h, scale = 1.0, dy = 0) {
    return scale * (top + height + dy / this.hscale);
  }

  east(left, width, w, scale = 1.0, dx = 0) {
    return scale * (left + width + dx / this.wscale);
  }

  west(left, width, w, scale = 1.0, dx = 0) {
    return scale * (left - w + dx / this.wscale);
  }

  adjacentPanes() {
    var i, ip, j, jp, k, len, m, mp, n, np, pane, ref;
    [jp, mp, ip, np] = UI.jmin(this.cells);
    [this.northPane, this.southPane, this.eastPane, this.westPane] = [this.view.emptyPane, this.view.emptyPane, this.view.emptyPane, this.view.emptyPane];
    ref = this.view.panes;
    for (k = 0, len = ref.length; k < len; k++) {
      pane = ref[k];
      [j, m, i, n] = UI.jmin(pane.cells);
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

  createHtml() {
    return `<div id="${this.htmlId}" class="${this.classPrefix}"></div>`;
  }

  reset(select) {
    this.$.css({
      left: this.xs(this.left),
      top: this.ys(this.top),
      width: this.xs(this.width),
      height: this.ys(this.height)
    });
    this.onSelect(select);
  }

  css(left, top, width, height, select) {
    this.$.css({
      left: this.pc(left),
      top: this.pc(top),
      width: this.pc(width),
      height: this.pc(height)
    });
    this.onSelect(select);
  }

  animate(left, top, width, height, select, aniLinks = false, callback = null) {
    this.$.show().animate({
      left: this.pc(left),
      top: this.pc(top),
      width: this.pc(width),
      height: this.pc(height)
    }, this.view.speed, () => {
      return this.animateCall(callback, select);
    });
  }

  animateCall(callback, select) {
    this.onSelect(select);
    if (callback != null) {
      callback(this);
    }
  }

  onSelect(select) {
    this.geo = this.geom();
    if (this.page != null) {
      this.page.onSelect(this, select);
    }
  }

};
