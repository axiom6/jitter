import Dom from '../ui/Dom.js';
var Brew;

Brew = class Brew {
  constructor(stream, ui) {
    this.stream = stream;
    this.ui = ui;
    this.ui.addContent('Brew', this);
  }

  readyPane() {
    return Dom.vertBtns(this.stream, this.spec, 'img/brew/', 80, 0, 6);
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

export default Brew;
