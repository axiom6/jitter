import Dom from '../ui/Dom.js';
var Brew;

Brew = class Brew {
  constructor(stream, ui) {
    this.readyPane = this.readyPane.bind(this);
    this.readyView = this.readyView.bind(this);
    this.onChoice = this.onChoice.bind(this);
    this.stream = stream;
    this.ui = ui;
    this.ui.addContent('Brew', this);
    this.stream.subscribe('Choice', 'Brew', (choice) => {
      return this.onChoice(choice);
    });
    this.btns = {};
  }

  readyPane() {
    return Dom.vertBtns(this.stream, this.spec, this, 'img/brew/', 50, 25, 12);
  }

  readyView() {
    var src;
    src = "img/brew/" + spec['AutoDrip'].icon;
    this.$view = $(`<div ${Dom.panel(0, 0, 100, 100)}></div>`);
    this.$view.append(`<h1 ${Dom.label(0, 0, 100, 10)}>Brew</h1>`);
    this.$view.append(`  ${Dom.image(src, this.pane.toVh(80), this.pane.toVw(80))}`);
    return this.$view;
  }

  onChoice(choice) {
    Dom.onChoice(choice, 'Brew', this);
  }

};

export default Brew;
