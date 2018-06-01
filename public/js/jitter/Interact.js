import Util from '../util/Util.js';
import UI   from '../ui/UI.js';
import Dom  from '../ui/Dom.js';
var Interact,
  hasProp = {}.hasOwnProperty;

Interact = class Interact {
  constructor(stream, ui, name, specs) {
    this.readyPane = this.readyPane.bind(this);
    this.readyView = this.readyView.bind(this);
    this.onSelect = this.onSelect.bind(this);
    this.onEvents = this.onEvents.bind(this);
    this.doClick = this.doClick.bind(this);
    this.onEnters = this.onEnters.bind(this);
    this.stream = stream;
    this.ui = ui;
    this.name = name;
    this.specs = specs;
    this.ui.addContent(this.name, this);
    this.last = {
      name: ""
    };
  }

  readyPane() {
    this.stream.subscribe('Select', 'Interact', (select) => {
      return this.onSelect(select);
    });
    return this.horz();
  }

  readyView() {
    return $("<h1 style=\" display:grid; justify-self:center; align-self:center; \">Interact</h1>");
  }

  horz() {
    var $p, dx, f, h, hc, hp, key, n, r, ref, spec, t, tp, w, x, y;
    $p = $("<div class=\"panel\" style=\"position:relative; left:0; top: 0;  width:100%; height:100%; text-align:center;\"></div>");
    $p.append("<hr             style=\"position:absolute; left:0; top:38%; width:100%; height:  1%; z-index:1; color:white; background-color:white;\"></hr>");
    n = Util.lenObject(this.specs, UI.isChild);
    dx = 100 / n;
    w = dx * 0.6;
    tp = 4;
    hp = 80 - tp * 2;
    x = w * 2 - dx;
    ref = this.specs;
    for (key in ref) {
      if (!hasProp.call(ref, key)) continue;
      spec = ref[key];
      if (!(UI.isChild(key))) {
        continue;
      }
      [y, hc] = spec.type === 'pack' ? [10, hp] : [25, hp * 0.66];
      [w, h, t, r, f] = this.geom(hc, tp);
      spec.$e = this.action(x, y, w, h, r, t, f, key);
      spec.name = key;
      if (spec.type === 'pack') {
        this.onEvents(spec.$e, key);
      }
      if (spec.type === 'pane') {
        this.onEnters(spec.$e, key);
      }
      $p.append(spec.$e);
      x = x + dx;
    }
    return $p;
  }

  geom(h, tp) {
    var f, r, t, w;
    w = this.pane.toVmin(h * 1.6);
    h = this.pane.toVmin(h);
    t = this.pane.toVmin(tp);
    r = h * 0.50;
    f = r * 0.65;
    return [w, h, t, r, f];
  }

  action(x, y, w, h, r, t, f, label) {
    var $e, left, style;
    left = Util.toFixed(x, 2);
    style = `display:table; border:black solid ${t}vmin; border-radius:${r}vmin; position:absolute; left:${left}%; top:${y}%; width:${w}vmin; height:${h}vmin; text-align:center; z-index:2;`;
    $e = $(`<div class="action" style="${style}"></div>`);
    $e.append(`<div style="display:table-cell; vertical-align:middle; font-size:${f}vmin;">${label}</div>`);
    return $e;
  }

  onSelect(select) {
    var spec;
    if (select.name === this.last.name || select.intent !== UI.SelectPack || (this.spec == null)) {
      return;
    }
    spec = this.specs[select.name];
    if (Util.isStr(this.last.name)) {
      this.last.$e.removeClass('action-active').addClass('action');
    }
    spec.$e.removeClass('action').addClass('action-active');
    //console.info( 'Interact.onSelect()', select, spec.$e.attr('class'), spec.$e.first().text(), @specs ) if @stream.isInfo('Select')
    this.last = spec;
  }

  onEvents($e, key) {
    $e.on('click', () => {
      return this.doClick($e, key);
    });
  }

  doClick($e, key) {
    var select;
    select = UI.toTopic(key, 'Interact', UI.SelectPack);
    this.stream.publish('Select', select);
  }

  onEnters($e, key) {
    var pane;
    pane = this.ui.view.getPane(key);
    pane.$.on('mouseenter', () => {
      return $e.removeClass('action').addClass('action-inpane');
    });
    pane.$.on('mouseleave', () => {
      return $e.removeClass('action-inpane').addClass('action');
    });
  }

  readyView() {
    return this.readyPane();
  }

};

export default Interact;
