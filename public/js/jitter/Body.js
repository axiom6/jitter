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
    var src;
    src = "img/body/Body.jpg";
    this.$view = $(`<div ${Dom.panel(0, 0, 100, 100)}></div>`);
    this.$view.append(`<h1 ${Dom.label(0, 0, 100, 10)}>Body</h1>`);
    this.$view.append(`  ${Dom.image(src, 80, 80)}`);
    return this.$view;
  }

  onChoice(choice) {
    Dom.onChoice(choice, 'Body', this);
  }

};

export default Body;
