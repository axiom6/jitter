var Dom,
  hasProp = {}.hasOwnProperty;

import Util from '../util/Util.js';

import UI from '../ui/UI.js';

export default Dom = (function() {
  class Dom {
    static panel(x, y, w, h, align = "center") {
      return `class="panel" style="position:relative; left:${x}%; top:${y}%; width:${w}%; height:${h}%; text-align:${align};" `;
    }

    static label(x, y, w, h, klass = "label") {
      return `class="${klass}" style="position:absolute; left:${x}%; top:${y}%; width:${w}%; height:${h}%; text-align:center;" `;
    }

    static image(x, y, w, h, src, mh, label = "", radius = "6px", mw = 60) {
      var htm, klass, tstyle;
      klass = src != null ? "image" : "texts";
      tstyle = src != null ? "text-align:center; padding-top:3px;" : "text-align:center;"; // max-width:#{mh*4}vmin;
      htm = `<div class="${klass}" style="position:absolute; left:${x}%; top:${y}%; width:${w}%; height:${h}%; display:table;">`;
      htm += "<div style=\"display:table-cell; vertical-align:middle;\">";
      if (src != null) {
        htm += `<img style="display:block; margin-left:auto; margin-right:auto; max-height:${mh}vmin; max-width:${mw}vmin; border-radius:${radius};" src="${src}"/>`;
      }
      if (Util.isStr(label)) {
        htm += `<div class="label" style="${tstyle}">${label}</div>`;
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

    static doClick(stream, $e, spec, key, study, event) {
      var choice;
      Util.noop(event);
      if (study != null ? study.chosen : void 0) {
        study.chosen = false;
        $e.css({
          color: Dom.basisColor
        });
        choice = UI.select(spec.name, 'Dom', UI.DelChoice, key);
        choice.$click = $e;
        stream.publish('Choice', choice);
      } else {
        study.chosen = true;
        $e.css({
          color: Dom.choiceColor
        });
        choice = UI.select(spec.name, 'Dom', UI.AddChoice, key);
        choice.$click = $e;
        stream.publish('Choice', choice);
      }
    }

    static doEnter($e, study) {
      if (!(study != null ? study.chosen : void 0)) {
        return $e.css({
          color: Dom.hoverColor
        });
      }
    }

    static doLeave($e, study) {
      if (!(study != null ? study.chosen : void 0)) {
        return $e.css({
          color: Dom.basisColor
        });
      }
    }

    static onEvents(stream, $e, spec, key, study) {
      $e.on('click', function(event) {
        return Dom.doClick(stream, $e, spec, key, study, event);
      });
      $e.on('mouseenter', function() {
        return Dom.doEnter($e, study);
      });
      return $e.on('mouseleave', function() {
        return Dom.doLeave($e, study);
      });
    }

    static horz(stream, spec, imgDir, hpc = 1.00, x0 = 0, y0 = 0) {
      var $e, $p, dx, key, n, src, study, th, x, y;
      th = spec.name === 'Roast' ? 18 : 13; // A hack
      $p = $(`<div   ${Dom.panel(0, 0, 100, 100)}></div>`);
      $p.append(`<h2 ${Dom.label(0, th, 10, 90)}>${spec.name}</h2>`);
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
        $e = $(`${Dom.image(x, y, dx, 100 * hpc, src, 9 * hpc, study.name)}`);
        Dom.onEvents(stream, $e, spec, key, study);
        $p.append($e);
        x = x + dx;
      }
      return $p;
    }

    static vert(stream, spec, imgDir, hpc = 1.00, x0 = 0, y0 = 0, align = "center") {
      var $e, $p, dy, key, n, src, study, x, y;
      $p = $(`<div    ${Dom.panel(0, 0, 100, 100, align)}></div>`);
      $p.append(`<div ${Dom.label(0, 3, 100, 10)}>${spec.name}</div>`);
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
        $e = $(`${Dom.image(x, y, 100, dy * hpc, src, 9 * hpc, study.name)}`);
        Dom.onEvents(stream, $e, spec, key, study);
        $p.append($e);
        y = y + dy;
      }
      return $p;
    }

    static tree(stream, spec, x0 = 0, y0 = 0) {
      var $p, dy, key, n, study, x, y;
      $p = $(`<div    ${Dom.panel(0, 0, 100, 100, "left")}></div>`);
      $p.append(`<div ${Dom.label(0, 3, 100, 10)}>${spec.name}</div>`);
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
        study.$e = $(`${Dom.branch(x, y, 100, dy, study.name)}`);
        study.num = 0;
        Dom.onEvents(stream, study.$e, spec, key, study);
        $p.append(study.$e);
        y = y + dy;
      }
      return $p;
    }

  };

  Dom.choiceColor = "yellow";

  Dom.hoverColor = "wheat";

  Dom.basisColor = "white";

  Dom.opacity = 0.6;

  return Dom;

}).call(this);
