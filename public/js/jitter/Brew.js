var Brew;

import Dom from '../ui/Dom.js';

export default Brew = class Brew {
  constructor(stream, ui) {
    this.stream = stream;
    this.ui = ui;
    this.ui.addContent('Brew', this);
  }

  readyPane() {
    return Dom.vert(this.stream, this.spec, 'img/brew/', 0.50, 0, 12);
  }

  readyView() {
    var src;
    src = "img/brew/" + spec['AutoDrip'].icon;
    this.$view = $(`<div ${Dom.panel(0, 0, 100, 100)}></div>`);
    this.$view.append(`<h1 ${Dom.label(0, 0, 100, 10)}>Brew</h1>`);
    this.$view.append(`  ${Dom.image(0, 10, 100, 90, src, 150)}`);
    return this.$view;
  }

};
