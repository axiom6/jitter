var Jitter;

Jitter = class Jitter {
  //module.exports = Jitter
  static init() {
    Util.ready(function() {
      var page, stream, subjects, ui;
      subjects = ['Select', 'Content', 'Connect', 'Test', 'Plane', 'About', 'Slide', 'Image', 'Cursor', 'Navigate', 'Settings', 'Submit', 'Toggle'];
      stream = new Util.Stream(subjects);
      page = new Jitter.Page(stream);
      ui = new UI(stream, page);
      Util.noop(ui);
    });
  }

  static abs(x, y, w, h) {
    return `style="position:absolute; left:${x}%; top:${y}%; width:${w}%; height:${h}%; text-align:center; font-size:24px;" `;
  }

  static abi(x, y, w, h, src, mh, label = "") {
    var htm;
    htm = `<div     style="position:absolute; left:${x}%; top:${y}%; width:${w}%; height:${h}%; display:table;">\n<div   style="display:table-cell; vertical-align:middle;">\n  <img style="display:block; margin-left:auto; margin-right:auto; max-height:${mh}px;" src="${src}"/>`;
    if (Util.isStr(label)) {
      htm += `<div style="color:white; font-size:20px; padding-top:4px;">${label}</div>`;
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

};
