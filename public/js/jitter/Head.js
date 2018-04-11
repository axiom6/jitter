import Dom  from '../ui/Dom.js';
var Head;

Head = class Head {
  constructor(stream, ui, name) {
    this.stream = stream;
    this.ui = ui;
    this.name = name;
    this.ui.addContent(this.name, this);
  }

  readyPane() {
    var src;
    src = "img/logo/JitterBoxHead.png";
    return $(`  ${Dom.image(0, 0, 100, 100, src, 22, "", "24px", 105)}`);
  }

  readyView() {
    return this.readyPane();
  }

};

export default Head;
