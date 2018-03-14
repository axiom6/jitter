var Jitter,
  hasProp = {}.hasOwnProperty;

Jitter = class Jitter {
  static init() {
    Util.ready(function() {
      var page, subjects, ui;
      subjects = ['Select', 'Choice'];
      Jitter.stream = new Util.Stream(subjects);
      page = new Jitter.Page(Jitter.stream);
      ui = new UI(Jitter.stream, page);
      Util.noop(ui);
    });
  }

  static abs(x, y, w, h) {
    return `style="position:absolute; left:${x}%; top:${y}%; width:${w}%; height:${h}%; text-align:center; font-size:24px; color:white;" `;
  }

  static abi(x, y, w, h, src, mh, label = "") {
    var htm;
    htm = `<div style="position:absolute; left:${x}%; top:${y}%; width:${w}%; height:${h}%; display:table; color:white;">`;
    htm += "<div style=\"display:table-cell; vertical-align:middle;\">";
    if (src != null) {
      htm += `<img style="display:block; margin-left:auto; margin-right:auto; max-height:${mh}px;" src="${src}"/>`;
    }
    if (Util.isStr(label)) {
      htm += `<div style="font-size:14px; padding-top:6px; line-height:16px">${label}</div>`;
    }
    htm += "</div></div>";
    return htm;
  }

  static abt(x, y, w, h, label = "") {
    var htm;
    htm = `<div style="position:absolute; left:${x}%; top:${y}%; width:${w}%; height:${h}%; display:table; color:white;">`;
    if (Util.isStr(label)) {
      htm += `<div style="font-size:14px; padding-top:2%; line-height:16px;">${label}</div>`;
    }
    htm += "</div>";
    return htm;
  }

  static rel(x, y, w, h, align = "center") {
    return `style="position:relative; left:${x}%; top:${y}%; width:${w}%; height:${h}%; text-align:${align};" `;
  }

  static img(src) {
    return `<div style="display:table-cell; vertical-align:middle;"><img style="display:block; margin-left:auto; margin-right:auto;" src="${src}"/></div>`;
  }

  static txt() {
    return "style=\"color:white; text-align:center;\"  ";
  }

  static doClick($e, spec, key, study, event) {
    var choice;
    Util.noop(event);
    if (study != null ? study.chosen : void 0) {
      study.chosen = false;
      $e.css({
        color: "white"
      });
      choice = UI.select(spec.name, 'Jitter', UI.DelChoice, key);
      choice.$click = $e;
      Jitter.stream.publish('Choice', choice);
    } else {
      study.chosen = true;
      $e.css({
        color: "yellow"
      });
      choice = UI.select(spec.name, 'Jitter', UI.AddChoice, key);
      choice.$click = $e;
      Jitter.stream.publish('Choice', choice);
    }
  }

  static doEnter($e, study) {
    if (!(study != null ? study.chosen : void 0)) {
      return $e.css({
        color: "wheat"
      });
    }
  }

  static doLeave($e, study) {
    if (!(study != null ? study.chosen : void 0)) {
      return $e.css({
        color: "white"
      });
    }
  }

  static onEvents($e, spec, key, study) {
    $e.on('click', function(event) {
      return Jitter.doClick($e, spec, key, study, event);
    });
    $e.on('mouseenter', function() {
      return Jitter.doEnter($e, study);
    });
    return $e.on('mouseleave', function() {
      return Jitter.doLeave($e, study);
    });
  }

  static horz(pane, spec, imgDir, hpc = 1.00, x0 = 0, y0 = 0) {
    var $e, $p, dx, key, n, src, study, th, x, y;
    th = spec.name === 'Roast' ? 18 : 13; // A hack
    $p = $(`<div   ${Jitter.rel(0, 0, 100, 100)}></div>`);
    $p.append(`<h2 ${Jitter.abs(0, th, 10, 90)}>${spec.name}</h2>`);
    n = Util.lenObject(spec, UI.isChild);
    x = x0;
    y = y0;
    dx = (100 - x0) / n;
    for (key in spec) {
      if (!hasProp.call(spec, key)) continue;
      study = spec[key];
      if (!(UI.isChild(key))) {
        continue;
      }
      src = study.icon != null ? imgDir + study.icon : null;
      $e = $(`${Jitter.abi(x, y, dx, 100 * hpc, src, 65 * hpc, study.name)}`);
      Jitter.onEvents($e, spec, key, study);
      $p.append($e);
      x = x + dx;
    }
    pane.$.append($p);
  }

  static vert(pane, spec, imgDir, hpc = 1.00, x0 = 0, y0 = 0, align = "center") {
    var $e, $p, dy, key, n, src, study, x, y;
    $p = $(`<div   ${Jitter.rel(0, 0, 100, 100, align)}></div>`);
    $p.append(`<h2 ${Jitter.abs(0, 0, 100, 10)}>${spec.name}</h2>`);
    n = Util.lenObject(spec, UI.isChild);
    x = x0;
    y = y0;
    dy = (100 - y0 - 5) / n;
    for (key in spec) {
      if (!hasProp.call(spec, key)) continue;
      study = spec[key];
      if (!(UI.isChild(key))) {
        continue;
      }
      src = study.icon != null ? imgDir + study.icon : null;
      $e = $(`${Jitter.abi(x, y, 100, dy * hpc, src, 65 * hpc, study.name)}`);
      Jitter.onEvents($e, spec, key, study);
      $p.append($e);
      y = y + dy;
    }
    pane.$.append($p);
  }

  static tree(pane, spec, x0 = 0, y0 = 0) {
    var $p, dy, key, n, study, x, y;
    $p = $(`<div   ${Jitter.rel(0, 0, 100, 100, "left")}></div>`);
    $p.append(`<h2 ${Jitter.abs(0, 0, 100, 10)}>${spec.name}</h2>`);
    n = Util.lenObject(spec, UI.isChild);
    x = x0;
    y = y0;
    dy = (100 - y0) / n;
    for (key in spec) {
      if (!hasProp.call(spec, key)) continue;
      study = spec[key];
      if (!(UI.isChild(key))) {
        continue;
      }
      study.$e = $(`${Jitter.abt(x, y, 100, dy, study.name)}`);
      study.num = 0;
      Jitter.onEvents(study.$e, spec, key, study);
      $p.append(study.$e);
      y = y + dy;
    }
    pane.$.append($p);
  }

};
