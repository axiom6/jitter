import Dom from '../ui/Dom.js';
var Body;

Body = class Body {
  constructor(stream, ui) {
    this.readyPane = this.readyPane.bind(this);
    this.readyView = this.readyView.bind(this);
    this.onChoice = this.onChoice.bind(this);
    this.stream = stream;
    this.ui = ui;
    this.ui.addContent('Body', this);
    this.stream.subscribe('Choice', 'Body', (choice) => {
      return this.onChoice(choice);
    });
    this.btns = {};
  }

  readyPane() {
    return Dom.vertBtns(this.stream, this.spec, this, 'img/body/', 45, 25, 12);
  }

  readyView() {
    return $("<h1 style=\" display:grid; justify-self:center; align-self:center; \">Body</h1>");
  }

  onChoice(choice) {
    Dom.onChoice(choice, 'Body', this);
  }

};

export default Body;
