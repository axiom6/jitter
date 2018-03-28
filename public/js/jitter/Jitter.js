var Jitter,
  hasProp = {}.hasOwnProperty;

Jitter = (function() {
  class Jitter {
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

    static panel(x, y, w, h, align = "center") {
      return `class="panel" style="position:relative; left:${x}%; top:${y}%; width:${w}%; height:${h}%; text-align:${align};" `;
    }

    static label(x, y, w, h, klass = "label") {
      return `class="${klass}" style="position:absolute; left:${x}%; top:${y}%; width:${w}%; height:${h}%; text-align:center;" `;
    }

    static image(x, y, w, h, src, mh, label = "", radius = "6px") {
      var htm, klass, tstyle;
      klass = src != null ? "image" : "texts";
      tstyle = src != null ? "padding-top:3px;" : ""; // max-width:#{mh*4}vmin;
      htm = `<div class="${klass}" style="position:absolute; left:${x}%; top:${y}%; width:${w}%; height:${h}%; display:table;">`;
      htm += "<div style=\"display:table-cell; vertical-align:middle;\">";
      if (src != null) {
        htm += `<img style="display:block; margin-left:auto; margin-right:auto; max-height:${mh}vmin; border-radius:${radius};" src="${src}"/>`;
      }
      if (Util.isStr(label)) {
        htm += `<div style="${tstyle}">${label}</div>`;
      }
      htm += "</div></div>";
      return htm;
    }

    static branch(x, y, w, h, label = "") {
      var htm;
      htm = `<div class="branch" style="position:absolute; left:${x}%; top:${y}%; width:${w}%; height:${h}%; display:table;">`;
      if (Util.isStr(label)) {
        htm += `<div <div style="">${label}</div>`;
      }
      htm += "</div>";
      return htm;
    }

    static img(src) {
      return `<div class="img" style="display:table-cell; vertical-align:middle;"><img style="display:block; margin-left:auto; margin-right:auto;" src="${src}"/></div>`;
    }

    static txt(str) {
      return `<div class="txt"">${str}</div>`;
    }

    static doClick($e, spec, key, study, event) {
      var choice;
      Util.noop(event);
      if (study != null ? study.chosen : void 0) {
        study.chosen = false;
        $e.css({
          color: Jitter.basisColor
        });
        choice = UI.select(spec.name, 'Jitter', UI.DelChoice, key);
        choice.$click = $e;
        Jitter.stream.publish('Choice', choice);
      } else {
        study.chosen = true;
        $e.css({
          color: Jitter.choiceColor
        });
        choice = UI.select(spec.name, 'Jitter', UI.AddChoice, key);
        choice.$click = $e;
        Jitter.stream.publish('Choice', choice);
      }
    }

    static doEnter($e, study) {
      if (!(study != null ? study.chosen : void 0)) {
        return $e.css({
          color: Jitter.hoverColor
        });
      }
    }

    static doLeave($e, study) {
      if (!(study != null ? study.chosen : void 0)) {
        return $e.css({
          color: Jitter.basisColor
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
      $p = $(`<div   ${Jitter.panel(0, 0, 100, 100)}></div>`);
      $p.append(`<h2 ${Jitter.label(0, th, 10, 90)}>${spec.name}</h2>`);
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
        $e = $(`${Jitter.image(x, y, dx, 100 * hpc, src, 9 * hpc, study.name)}`);
        Jitter.onEvents($e, spec, key, study);
        $p.append($e);
        x = x + dx;
      }
      pane.$.append($p);
    }

    static vert(pane, spec, imgDir, hpc = 1.00, x0 = 0, y0 = 0, align = "center") {
      var $e, $p, dy, key, n, src, study, x, y;
      $p = $(`<div    ${Jitter.panel(0, 0, 100, 100, align)}></div>`);
      $p.append(`<div ${Jitter.label(0, 3, 100, 10)}>${spec.name}</div>`);
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
        $e = $(`${Jitter.image(x, y, 100, dy * hpc, src, 9 * hpc, study.name)}`);
        Jitter.onEvents($e, spec, key, study);
        $p.append($e);
        y = y + dy;
      }
      pane.$.append($p);
    }

    static tree(pane, spec, x0 = 0, y0 = 0) {
      var $p, dy, key, n, study, x, y;
      $p = $(`<div    ${Jitter.panel(0, 0, 100, 100, "left")}></div>`);
      $p.append(`<div ${Jitter.label(0, 3, 100, 10)}>${spec.name}</div>`);
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
        study.$e = $(`${Jitter.branch(x, y, 100, dy, study.name)}`);
        study.num = 0;
        Jitter.onEvents(study.$e, spec, key, study);
        $p.append(study.$e);
        y = y + dy;
      }
      pane.$.append($p);
    }

  };

  Jitter.choiceColor = "yellow";

  Jitter.hoverColor = "wheat";

  Jitter.basisColor = "white";

  Jitter.opacity = 0.6;

  return Jitter;

}).call(this);
