var Interact,
  boundMethodCheck = function(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new Error('Bound instance method accessed before binding'); } },
  hasProp = {}.hasOwnProperty;

import Util from '../util/Util.js';

import UI from '../ui/UI.js';

import Base from '../ui/Base.js';

Interact = class Interact extends Base {
  constructor(stream, ui, name, specs) {
    super(stream, ui, name, 'Interact');
    this.ready = this.ready.bind(this);
    this.onSelect = this.onSelect.bind(this);
    this.onEvents = this.onEvents.bind(this);
    this.doClick = this.doClick.bind(this);
    this.onEnters = this.onEnters.bind(this);
    this.specs = specs;
    this.lastSelect = "";
    this.stream.subscribe('Select', 'Interact', (select) => {
      return this.onSelect(select);
    });
    if (false) {
      console.log(this.specs, this.lastSelect);
    }
  }

  ready(cname) {
    boundMethodCheck(this, Interact);
    Util.noop(cname);
    return this.horz();
  }

  horz() {
    var $e, $p, dx, f, h, hc, hp, key, n, r, ref, spec, t, tp, w, x, y;
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
      $e = this.action(x, y, w, h, r, t, f, key);
      if (spec.type === 'pack') {
        this.onEvents($e, key);
      }
      if (spec.type === 'pane') {
        this.onEnters($e, key);
      }
      $p.append($e);
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

  action(x, y, w, h, r, t, f, name) {
    var $e, htmlId, label, left, style;
    left = Util.toFixed(x, 2);
    htmlId = Util.htmlId('Interact', name);
    label = Util.inString(name, 'Summary') ? 'Summary' : name;
    style = `display:table; border:black solid ${t}vmin; border-radius:${r}vmin; position:absolute; left:${left}%; top:${y}%; width:${w}vmin; height:${h}vmin; text-align:center; z-index:2;`;
    $e = $(`<div id="${htmlId}" class="action" style="${style}"></div>`);
    $e.append(`<div style="display:table-cell; vertical-align:middle; font-size:${f}vmin;">${label}</div>`);
    return $e;
  }

  onSelect(select) {
    boundMethodCheck(this, Interact);
    if (select.name === this.lastSelect || select.intent !== UI.SelectPack) {
      return;
    }
    if (this.stream.isInfo('Select')) {
      console.info('Interact.onSelect()', select);
    }
    if (Util.isStr(this.lastSelect)) {
      $('#Interact' + this.lastSelect).removeClass('action-active').addClass('action');
    }
    $('#Interact' + select.name).removeClass('action').addClass('action-active');
    this.lastSelect = select.name;
  }

  onEvents($e, key) {
    boundMethodCheck(this, Interact);
    $e.on('click', () => {
      return this.doClick($e, key);
    });
  }

  doClick($e, key) {
    var select;
    boundMethodCheck(this, Interact);
    select = UI.toTopic(key, 'Interact', UI.SelectPack);
    this.stream.publish('Select', select);
  }

  onEnters($e, key) {
    var pane;
    boundMethodCheck(this, Interact);
    pane = this.ui.view.getPane(key);
    pane.$.on('mouseenter', () => {
      return $e.removeClass('action').addClass('action-inpane');
    });
    pane.$.on('mouseleave', () => {
      return $e.removeClass('action-inpane').addClass('action');
    });
  }

  readyView() {
    return $("<h1 style=\" display:grid; justify-self:center; align-self:center; \">Interact</h1>");
  }

};

export default Interact;
