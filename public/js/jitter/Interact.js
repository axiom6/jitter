import Util from '../util/Util.js';
import UI   from '../ui/UI.js';
import Dom  from '../ui/Dom.js';
var Interact,
  hasProp = {}.hasOwnProperty;

Interact = class Interact {
  constructor(stream1, ui, name, specInteract) {
    this.readyPane = this.readyPane.bind(this);
    this.readyView = this.readyView.bind(this);
    this.onSelect = this.onSelect.bind(this);
    this.onEvents = this.onEvents.bind(this);
    this.stream = stream1;
    this.ui = ui;
    this.name = name;
    this.specInteract = specInteract;
    this.ui.addContent(this.name, this);
    this.stream.subscribe('Select', 'Interact', (select) => {
      return this.onSelect(select);
    });
    this.last = {
      name: ""
    };
  }

  readyPane() {
    this.spec = this.specInteract; // Qverride?
    return this.horz();
  }

  readyView() {
    return $("<h1 style=\" display:grid; justify-self:center; align-self:center; \">Interact</h1>");
  }

  horz() {
    var $e, $p, dx, f, h, hc, hp, key, n, r, ref, study, t, tp, w, x, y;
    $p = $("<div class=\"panel\" style=\"position:relative; left:0; top: 0;  width:100%; height:100%; text-align:center;\"></div>");
    $p.append("<hr             style=\"position:absolute; left:0; top:38%; width:100%; height:  1%; z-index:1; color:white; background-color:white;\"></hr>");
    n = Util.lenObject(this.spec, UI.isChild);
    dx = 100 / n;
    w = dx * 0.6;
    tp = 4;
    hp = 80 - tp * 2;
    x = w * 2 - dx;
    ref = this.spec;
    for (key in ref) {
      if (!hasProp.call(ref, key)) continue;
      study = ref[key];
      if (!(UI.isChild(key))) {
        continue;
      }
      study.name = key;
      [y, hc] = study.type === 'pack' ? [10, hp] : [25, hp * 0.66];
      [w, h, t, r, f] = this.geom(hc, tp);
      $e = this.action(x, y, w, h, r, t, f, key);
      if (study.type === 'pack') {
        this.onEvents(this.stream, $e, key, study);
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

  action(x, y, w, h, r, t, f, label, klass = "action") {
    var $c, left, style;
    left = Util.toFixed(x, 2);
    style = `display:table; border:black solid ${t}vmin; border-radius:${r}vmin; position:absolute; left:${left}%; top:${y}%; width:${w}vmin; height:${h}vmin; text-align:center; z-index:2;`;
    //console.log( 'Interact.circle()', { style:style } )
    $c = $(`<div class="${klass}" style="${style}"></div>`);
    $c.append(`<div style="display:table-cell; vertical-align:middle; font-size:${f}vmin;">${label}</div>`);
    return $c;
  }

  doClick(stream, $e, key, study) {
    var select;
    select = UI.toTopic(key, 'Interact', UI.SelectPack, study);
    stream.publish('Select', select);
  }

  onSelect(select) {
    var study;
    if (select.name === this.last.name || select.intent !== UI.SelectPack) {
      return;
    }
    study = this.spec[select.name];
    if (Util.isStr(this.last.name)) {
      this.last.$e.removeClass('action-active');
    }
    study.$e.addClass('action-active');
    this.last = study;
  }

  onEvents(stream, $e, key, study) {
    study.$e = $e;
    return $e.on('click', () => {
      return this.doClick(stream, $e, key, study); // (event)
    });
  }

  readyView() {
    return this.readyPane();
  }

};

export default Interact;
