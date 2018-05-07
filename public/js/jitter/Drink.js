import Dom  from '../ui/Dom.js';
var Drink;

Drink = class Drink {
  constructor(stream, ui) {
    this.onChoice = this.onChoice.bind(this);
    this.stream = stream;
    this.ui = ui;
    this.ui.addContent('Drink', this);
    this.stream.subscribe('Choice', 'Drink', (choice) => {
      return this.onChoice(choice);
    });
    this.btns = {};
  }

  readyPane() {
    return Dom.vertBtns(this.stream, this.spec, this, 'img/drink/', 60, 25, 12);
  }

  readyView() {
    var src;
    src = "img/drink/Drink.jpg";
    this.$view = $(`<div ${Dom.panel(0, 0, 100, 100)}></div>`);
    this.$view.append(`<h1 ${Dom.label(0, 0, 100, 10)}>Drink</h1>`);
    this.$view.append(`  ${Dom.image(src, this.pane.toVh(80), this.pane.toVw(80))}`);
    return this.$view;
  }

  onChoice(choice) {
    Dom.onChoice(choice, 'Drink', this);
  }

};

export default Drink;
