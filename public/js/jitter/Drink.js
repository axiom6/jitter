var Drink;

import Dom from '../ui/Dom.js';

export default Drink = class Drink {
  constructor(stream, ui) {
    this.stream = stream;
    this.ui = ui;
    this.ui.addContent('Drink', this);
  }

  readyPane() {
    return Dom.vertBtns(this.stream, this.spec, 'img/drink/', 0.75, 0, 10);
  }

  readyView() {
    var src;
    src = "img/drink/Drink.jpg";
    this.$view = $(`<div ${Dom.panel(0, 0, 100, 100)}></div>`);
    this.$view.append(`<h1 ${Dom.label(0, 0, 100, 10)}>Drink</h1>`);
    this.$view.append(`  ${Dom.image(0, 10, 100, 90, src, 150)}`);
    return this.$view;
  }

};
