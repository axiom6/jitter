import Dom  from '../ui/Dom.js';
var Drink;

Drink = class Drink {
  constructor(stream, ui) {
    this.readyPane = this.readyPane.bind(this);
    this.readyView = this.readyView.bind(this);
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
    return Dom.vertBtns(this.stream, this.spec, this, 'img/drink/', 50, 25, 12);
  }

  readyView() {
    return $("<h1 style=\" display:grid; justify-self:center; align-self:center; \">Drink</h1>");
  }

  onChoice(choice) {
    Dom.onChoice(choice, 'Drink', this);
  }

};

export default Drink;
