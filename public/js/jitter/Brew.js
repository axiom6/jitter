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
    return Dom.vertBtns(this.stream, this.spec, this, 'img/brew/', 80, 10, 12);
  }

  readyView() {
    return $("<h1 style=\" display:grid; justify-self:center; align-self:center; \">Brew</h1>");
  }

  onChoice(choice) {
    Dom.onChoice(choice, 'Brew', this);
  }

};

export default Brew;
