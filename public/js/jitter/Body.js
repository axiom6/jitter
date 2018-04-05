var Body;

import Dom from '../ui/Dom.js';

export default Body = class Body {
  constructor(stream, ui) {
    this.stream = stream;
    this.ui = ui;
    this.ui.addContent('Body', this);
  }

  readyPane() {
    return Dom.vert(this.stream, this.spec, 'img/body/', 0.75, 0, 10);
  }

  readyView() {
    var src;
    src = "img/body/Body.jpg";
    this.$view = $(`<div ${Dom.panel(0, 0, 100, 100)}></div>`);
    this.$view.append(`<h1 ${Dom.label(0, 0, 100, 10)}>Body</h1>`);
    this.$view.append(`  ${Dom.image(0, 10, 100, 90, src, 150)}`);
    return this.$view;
  }

};
