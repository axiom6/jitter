var Jitter;

Jitter = class Jitter {
  static init() {
    Util.ready(function() {
      var page, stream, subjects, ui;
      subjects = ['Select'];
      stream = new Util.Stream(subjects);
      page = new Jitter.Page(stream);
      ui = new UI(stream, page);
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

  static rel(x, y, w, h) {
    return `style="position:relative; left:${x}%; top:${y}%; width:${w}%; height:${h}%; text-align:center;" `;
  }

  static img(src) {
    return `<div style="display:table-cell; vertical-align:middle;"><img style="display:block; margin-left:auto; margin-right:auto;" src="${src}"/></div>`;
  }

  static txt() {
    return "style=\"color:white; text-align:center;\"  ";
  }

  static doClick($e, spec, item, event) {
    Util.noop(event);
    if (item != null ? item.selected : void 0) {
      item.selected = false;
      $e.css({
        color: "white"
      });
      console.log('Jitter.doClick unselect', {
        menu: spec.name,
        choice: item.name.replace(/<.br>/g, ' ')
      });
    } else {
      item.selected = true;
      $e.css({
        color: "yellow"
      });
      console.log('Jitter.doClick selected', {
        menu: spec.name,
        choice: item.name.replace(/<.br>/g, ' ')
      });
    }
  }

  static doEnter($e, item) {
    if (!(item != null ? item.selected : void 0)) {
      return $e.css({
        color: "wheat"
      });
    }
  }

  static doLeave($e, item) {
    if (!(item != null ? item.selected : void 0)) {
      return $e.css({
        color: "white"
      });
    }
  }

  static onEvents($e, spec, item, doClick, doEnter, doLeave) {
    $e.on('click', function(event) {
      return doClick($e, spec, item, event);
    });
    $e.on('mouseenter', function() {
      return doEnter($e, item);
    });
    return $e.on('mouseleave', function() {
      return doLeave($e, item);
    });
  }

  static horz(pane, spec, imgDir, hpc = 1.00, x0 = 0, y0 = 0) {
    var $e, $p, array, dx, i, j, n, ref, src, th, where, x, y;
    th = spec.name === 'Roast' ? 18 : 13; // A hack
    $p = $(`<div   ${Jitter.rel(0, 0, 100, 100)}></div>`);
    $p.append(`<h2 ${Jitter.abs(0, th, 10, 90)}>${spec.name}</h2>`);
    where = function(key) {
      return UI.isChild(key);
    };
    array = Util.toArray(spec, where, 'id');
    n = array.length;
    i = 0;
    x = x0;
    y = y0;
    dx = (100 - x0) / n;
    for (i = j = 0, ref = n; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
      src = array[i].icon != null ? imgDir + array[i].icon : null;
      $e = $(`${Jitter.abi(x, y, dx, 100 * hpc, src, 65 * hpc, array[i].name)}`);
      Jitter.onEvents($e, spec, array[i], Jitter.doClick, Jitter.doEnter, Jitter.doLeave);
      $p.append($e);
      x = x + dx;
    }
    pane.$.append($p);
  }

  static vert(pane, spec, imgDir, hpc = 1.00, x0 = 0, y0 = 0) {
    var $e, $p, array, dy, i, j, n, ref, src, where, x, y;
    $p = $(`<div   ${Jitter.rel(0, 0, 100, 100)}></div>`);
    $p.append(`<h2 ${Jitter.abs(0, 0, 100, 10)}>${spec.name}</h2>`);
    where = function(key) {
      return UI.isChild(key);
    };
    array = Util.toArray(spec, where, 'id');
    n = array.length;
    i = 0;
    x = x0;
    y = y0;
    dy = (100 - y0 - 5) / n;
    for (i = j = 0, ref = n; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
      src = array[i].icon != null ? imgDir + array[i].icon : null;
      $e = $(`${Jitter.abi(x, y, 100, dy * hpc, src, 65 * hpc, array[i].name)}`);
      Jitter.onEvents($e, spec, array[i], Jitter.doClick, Jitter.doEnter, Jitter.doLeave);
      $p.append($e);
      y = y + dy;
    }
    pane.$.append($p);
  }

};
