import Util    from '../util/Util.js';
import UI      from '../ui/UI.js';
var Dom,
  hasProp = {}.hasOwnProperty;

Dom = (function() {
  class Dom {
    // ------ Tag Attributes ------
    static klass(name) {
      //console.log( 'Dom.klass()', { name:name } )
      return `class="${name}" `;
    }

    static htmlId(name, type, ext = "") {
      return `id="${Util.htmlId(name, type, ext)}" `;
    }

    static style(...props) {
      var css, i, len, prop;
      css = "";
      for (i = 0, len = props.length; i < len; i++) {
        prop = props[i];
        css += prop + ' ';
      }
      return `style="${css}" `;
    }

    // ------ CSS Propterties ------
    static position(x, y, w, h, pos = "absolute", uom = "%") {
      return `position:${pos}; left:${x}${uom}; top:${y}${uom}; width:${w}${uom}; height:${h}${uom}; `;
    }

    static margin(l, t, r, b) {
      return `margin:${t} ${r} ${b} ${l
// Uoms supplies in args
}; `;
    }

    static padding(l, t, r, b) {
      return `padding:${t} ${r} ${b} ${l
// Uoms supplies in args
}; `;
    }

    static border(color, thick) {
      return `border:solid ${color} ${thick} `;
    }

    // ------ Html Constructs ------
    static panel(x, y, w, h, align = "center") {
      return `class="panel" style="position:relative; left:${x}%; top:${y}%; width:${w}%; height:${h}%; text-align:${align};" `;
    }

    static panel1(x, y, w, h, align = "center") {
      return `<div ${Dom.klass("panel")(Dom.style(Dom.position(x, y, w, h, "relative"), `text-align:${align};`))} </div>`;
    }

    static label(x, y, w, h, klass = "label") {
      return `class="${klass}" style="position:absolute; left:${x}%; top:${y}%; width:${w}%; height:${h}%; text-align:center;" `;
    }

    static image(src, mh, mw, label = "", radius = "6px") {
      var htm, tstyle;
      tstyle = `justify-self:center; align-self:center; font-size:${mh * 0.1}vh; padding-top:3px;`;
      if (src != null) {
        tstyle += "padding-top:3px;";
      }
      htm = "<div class=\"dom-wrapp\" style=\"display:grid; width:100%; height:100%;\">";
      if (src != null) {
        htm += `<img class="dom-image" style="justify-self:center; align-self:center; max-height:${mh}vh; max-width:${mw}vw; border-radius:${radius};" src="${src}"/>`;
      }
      if (Util.isStr(label)) {
        htm += `<div class="dom-label" style="${tstyle}">${label}</div>`;
      }
      htm += "</div>";
      return htm;
    }

    static image2(x, y, w, h, src, mh, label = "", radius = "6px", mw = 60) {
      var htm, tstyle;
      tstyle = src != null ? `padding-top:3px; font-size:${mh * 0.3}vh` : `font-size:${mh * 0.3}vh;`;
      htm = "<div style=\"display:grid; witth:100%; height:100%;\">";
      htm += "<div style=\"justify-self:center; align-self:center;\">";
      if (src != null) {
        htm += `<img style="max-height:${mh}vh; max-width:${mw}vw; border-radius:${radius};" src="${src}"/>`;
      }
      if (Util.isStr(label)) {
        htm += `<div style="${tstyle}">${label}</div>`;
      }
      htm += "</div></div>";
      return htm;
    }

    static image1(x, y, w, h, src, mh, label = "", radius = "6px", mw = 60) {
      var htm, klass, tstyle;
      klass = src != null ? "image" : "texts";
      tstyle = src != null ? `padding-top:3px; font-size:${mh * 0.3}vh` : `text-align:center; font-size:${mh * 0.3
      // max-width:#{mh*4}vmin;
}vh;`;
      htm = `<div class="${klass}" style="position:absolute; left:${x}%; top:${y}%; width:${w}%; height:${h}%;">`;
      htm += "<div style=\"display:flex;\">";
      if (src != null) {
        htm += `<img style="justify-self:center; align-self:center; max-height:${mh}vh; max-width:${mw}vw; border-radius:${radius};" src="${src}"/>`;
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
        htm += `<div style="">${label}</div>`;
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

    static doClick(stream, widget, spec, key, study, event) {
      var $e, choice;
      Util.noop(event);
      $e = widget.btns[key].$e;
      if (study != null ? study.chosen : void 0) {
        study.chosen = false;
        spec.num--;
        $e.css({
          color: Dom.basisColor
        });
        $e.find("button").removeClass("btn-nice-active");
        choice = UI.toTopic(spec.name, spec.name, UI.DelChoice, key); // spec.name and source are the same
        stream.publish('Choice', choice);
      } else if (spec.num < spec.max) {
        study.chosen = true;
        spec.num++;
        $e.css({
          color: Dom.choiceColor
        });
        $e.find("button").addClass("btn-nice-active");
        choice = UI.toTopic(spec.name, spec.name, UI.AddChoice, key); // spec.name and source are the same
        stream.publish('Choice', choice);
      } else {
        alert(`You can only make ${spec.max} choices for ${spec.name}`);
      }
    }

    //console.log( 'Dom.doClick', choice )
    static onChoice(choice, name, widget) {
      var $e;
      if (choice.name !== name || choice.source === name) {
        return;
      }
      // console.log( 'Dom.onChoice()', { name:name, choice:choice, btns:widget.btns, choiceName:choice.name } )
      if (!((widget.btns[choice.study] != null) && (widget.btns[choice.study].$e != null))) {
        console.error('Dom.onChoice()', {
          name: name,
          study: choice.study,
          btns: widget.btns
        });
        return;
      }
      $e = widget.btns[choice.study].$e;
      if ($e != null) {
        if (choice.intent === UI.AddChoice) {
          $e.find("button").addClass("btn-nice-active");
        } else {
          $e.find("button").removeClass("btn-nice-active");
        }
      } else {
        console.error("Dom.onChoice() $e missing for", {
          name: name,
          choice: choice
        });
      }
    }

    static doEnter(widget, key, study) {
      if (!(study != null ? study.chosen : void 0)) {
        return widget.btns[key].$e.css({
          color: Dom.hoverColor
        });
      }
    }

    static doLeave(widget, key, study) {
      if (!(study != null ? study.chosen : void 0)) {
        return widget.btns[key].$e.css({
          color: Dom.basisColor
        });
      }
    }

    static onEvents(stream, widget, spec, key, study) {
      var $e;
      $e = widget.btns[key].$e;
      $e.on('click', function(event) {
        return Dom.doClick(stream, widget, spec, key, study, event);
      });
      $e.on('mouseenter', function() {
        return Dom.doEnter(widget, key, study);
      });
      $e.on('mouseleave', function() {
        return Dom.doLeave(widget, key, study);
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
        Dom.addWidgetBtn(widget, key, $e);
        Dom.onEvents(stream, widget, spec, key, study);
        $p.append($e);
        x = x + dx;
      }
      return $p;
    }

    static vert(stream, spec, widget, imgDir, hpc = 1.00, x0 = 0, y0 = 0) {
      var $e, $p, dy, key, mh, n, src, study, x, y;
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
        mh = spec.pane.toVh(dy) * 0.6;
        $e = $(`${Dom.image(x, y, 100, dy * hpc, src, mh, study.name)}`);
        Dom.addWidgetBtn(widget, key, $e);
        Dom.onEvents(stream, widget, spec, key, study);
        $p.append($e);
        y = y + dy;
      }
      return $p;
    }

    static vertBtns(stream, spec, widget, imgDir, w = 50, x0 = 0, y0 = 0) {
      var $e, $p, back, dy, icon, iconc, key, mh, n, src, study, x, y;
      $p = $(`<div    ${Dom.panel(0, 0, 100, 100)}></div>`);
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
        src = study.img != null ? imgDir + study.img : null;
        icon = (src == null) && study.icon ? study.icon : null;
        iconc = (icon != null) && study.iconc ? study.iconc : null; // icon color
        back = study.back != null ? study.back : "#3B5999";
        mh = spec.pane.toVh(dy * 0.5);
        $e = $(Dom.btn(x, y, w, dy, back, study.name, icon, iconc, src, mh));
        Dom.addWidgetBtn(widget, key, $e);
        Dom.onEvents(stream, widget, spec, key, study);
        $p.append($e);
        y = y + dy; // https://is.gd/CEPUez
      }
      // console.log( 'Dom.vertButtons()', { btns:widget.btns } )
      return $p;
    }

    static btn(x, y, w, h, back = "#3B5999", label = null, icon = null, iconc = null, src = null, mh = null) {
      var htm;
      htm = `<div style="position:absolute; left:${x}%; top:${y}%; width:${w}%; height:${h}%;">`;
      htm += `<button class="btn-nice" style="background-color:${back}">`;
      if ((icon != null) && (iconc != null)) {
        htm += `<i      class="btn-icons ${icon} fa-lg" style="color:${iconc}"></i>`;
      }
      if ((src != null) && (mh != null)) {
        htm += `<img    class="btn-image" style="max-height:${mh}vh;" src="${src}"/>`;
      }
      if (label != null) {
        htm += `<div    class="btn-label">${label}</div>`;
      }
      htm += "</button></div>";
      return htm;
    }

    static tree(stream, spec, name, widget, x0 = 0, y0 = 0) {
      var $e, $p, dy, key, n, study, x, y;
      $p = $(`<div    ${Dom.panel(0, 0, 100, 100, "left")}></div>`);
      $p.append(`<div ${Dom.label(0, 3, 100, 10)}>${name}</div>`);
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
        $e = $(`${Dom.branch(x, y, 100, dy, study.name)}`);
        study.num = 0;
        Dom.addWidgetBtn(widget, key, $e);
        Dom.onEvents(stream, widget, spec, key, study);
        $p.append($e);
        y = y + dy;
      }
      return $p;
    }

    static addWidgetBtn(widget, key, $e) {
      widget.btns[key] = {};
      widget.btns[key].$e = $e;
    }

    static hasJQueryPlugin(plugin, issue = true) {
      var glob, has, plug;
      glob = Util.firstTok(plugin, '.');
      plug = Util.lastTok(plugin, '.');
      has = (window[glob] != null) && (window[glob][plug] != null);
      if (!has && issue) {
        console.error(`Util.hasPlugin()  $${glob + '.' + plug} not present`);
      }
      return has;
    }

    static cssPosition(screen, port, land) {
      var array;
      array = screen.orientation === 'Portrait' ? port : land;
      $.css(Util.toPositionPc(array));
    }

  };

  Dom.choiceColor = "yellow";

  Dom.hoverColor = "wheat";

  Dom.basisColor = "black";

  Dom.opacity = 0.6;

  return Dom;

}).call(this);

export default Dom;
