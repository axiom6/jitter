import Util from '../util/Util.js';
import UI   from '../ui/UI.js';
import Dom  from '../ui/Dom.js';
var Interact,
  hasProp = {}.hasOwnProperty;

Interact = class Interact {
  constructor(stream1, ui, name, specInteract) {
    this.onEvents = this.onEvents.bind(this);
    this.stream = stream1;
    this.ui = ui;
    this.name = name;
    this.specInteract = specInteract;
    this.ui.addContent(this.name, this);
  }

  readyPane() {
    this.spec = this.specInteract; // Qverride?
    //console.log( 'Interact.readyPane()', @spec )
    return this.horz();
  }

  horz() {
    var $e, $p, dx, f, fg, fp, h, hg, hp, key, n, r, ref, rg, rp, study, t, w, wg, wp, x, y, yg, yp;
    //console.log( 'Pane', @pane.width, @pane.height )
    $p = $("<div class=\"panel\" style=\"position:relative; left:0; top: 0;  width:100%; height:100%; text-align:center;\"></div>");
    $p.append("<hr             style=\"position:absolute; left:0; top:42%; width:100%; height:  2%; z-index:1;\"></hr>");
    n = Util.lenObject(this.spec, UI.isChild);
    dx = 100 / n;
    w = dx * 0.6;
    x = w * 2 - dx;
    t = 2;
    yg = 10;
    yp = 25;
    h = 80 - t * 2;
    r = h * 0.50;
    f = r * 0.50;
    wg = this.pane.toVmin(h);
    wp = wg * 0.66;
    hg = this.pane.toVmin(h);
    hp = hg * 0.66;
    t = this.pane.toVmin(t);
    rg = this.pane.toVmin(r);
    rp = rg * 0.66;
    fg = this.pane.toVmin(f);
    fp = fg * 0.66;
    ref = this.spec;
    for (key in ref) {
      if (!hasProp.call(ref, key)) continue;
      study = ref[key];
      if (!(UI.isChild(key))) {
        continue;
      }
      //console.log( 'Interact.horz()', key )
      [y, w, h, r, f] = study.type === 'group' ? [yg, wg, hg, rg, fg] : [yp, wp, hp, rp, fp];
      $e = this.circle(x, y, w, h, r, t, f, key);
      if (study.type === 'group') {
        this.onEvents(this.stream, $e, key, study);
      }
      $p.append($e);
      x = x + dx;
    }
    return $p;
  }

  /*
  select = UI.select( 'Maps', 'UI', UI.SelectGroup )
  @stream.publish( 'Select', select )
  */
  circle(x, y, w, h, r, t, f, label, klass = "circle") {
    var $c, style;
    style = `display:table; border:black solid ${t}vmin; border-radius:${r}vmin; position:absolute; left:${x}%; top:${y}%; width:${w}vmin; height:${h}vmin; text-align:center; z-index:2;`;
    //console.log( 'Interact.style', style )
    $c = $(`<div class="${klass}" style="${style}"></div>`);
    $c.append(`<div style="display:table-cell; vertical-align:middle; font-size:${f}vmin;">${label}</div>`);
    return $c;
  }

  readyView() {
    var src;
    src = "img/body/Body.jpg";
    this.$view = $(`<div ${Dom.panel(0, 0, 100, 100)}></div>`);
    this.$view.append(`<h1 ${Dom.label(0, 0, 100, 10)}>Body</h1>`);
    this.$view.append(`  ${Dom.image(src, this.pane.toVh(80), this.pane.toVw(80))}`);
    return this.$view;
  }

  doClick(stream, $e, key, study) {
    var select;
    study.chosen = false;
    $e.css({
      color: Dom.basisColor
    });
    select = UI.select(key, 'Interact', UI.SelectGroup, study);
    select.$click = $e;
    stream.publish('Select', select);
  }

  doEnter($e, study) {
    if (!(study != null ? study.chosen : void 0)) {
      return $e.css({
        color: Dom.hoverColor
      });
    }
  }

  doLeave($e, study) {
    if (!(study != null ? study.chosen : void 0)) {
      return $e.css({
        color: Dom.basisColor
      });
    }
  }

  onEvents(stream, $e, key, study) {
    $e.on('click', () => {
      return this.doClick(stream, $e, key, study); // (event)
    });
    $e.on('mouseenter', () => {
      return this.doEnter($e, study);
    });
    return $e.on('mouseleave', () => {
      return this.doLeave($e, study);
    });
  }

};

export default Interact;
