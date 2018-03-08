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

  //   "Overview": { "name":"Overview", "cells":[1,36,1,24], "toc":false, "pane":false },
  static abs(x, y, w, h) {
    return `style="position:absolute; left:${x}%; top:${y}%; width:${w}%; height:${h}%; text-align:center; font-size:24px; color:white;" `;
  }

  static abi(x, y, w, h, src, mh, label = "") {
    var htm;
    htm = `<div     style="position:absolute; left:${x}%; top:${y}%; width:${w}%; height:${h}%; display:table;">`;
    htm += "<div   style=\"display:table-cell; vertical-align:middle;\">";
    if (src != null) {
      htm += `<img style="display:block; margin-left:auto; margin-right:auto; max-height:${mh}px;" src="${src}"/>`;
    }
    if (Util.isStr(label)) {
      htm += `<div style="color:white; font-size:14px; padding-top:6px; line-height:16px">${label}</div>`;
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

  static ready(pane, spec, imgDir, hpc = 1.00) {
    var $e, array, dy, i, j, n, ref, src, where, x, y;
    $e = $(`<div   ${Jitter.rel(0, 0, 100, 100)}></div>`);
    $e.append(`<h2 ${Jitter.abs(0, 0, 100, 10)}>${spec.name}</h2>`);
    where = function(key) {
      return UI.isChild(key);
    };
    array = Util.toArray(spec, where, 'id');
    n = array.length;
    i = 0;
    x = 0;
    y = 10;
    dy = 90 / n;
    for (i = j = 0, ref = n; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
      src = array[i].icon != null ? imgDir + array[i].icon : null;
      $e.append(`${Jitter.abi(x, y, 100, dy * hpc, src, 65 * hpc, array[i].name)}`);
      y = y + dy;
    }
    pane.$.append($e);
  }

};
