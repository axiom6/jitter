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
    return $(`  ${Dom.image(src, this.pane.toVh(80), this.pane.toVw(80), "", "24px")}`);
  }

  readyView() {
    return this.readyPane();
  }

};

export default Head;
