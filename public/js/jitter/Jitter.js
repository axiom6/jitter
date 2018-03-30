var Jitter;

Jitter = class Jitter {
  static init() {
    Util.ready(function() {
      var jitter, stream, subjects, ui;
      subjects = ['Select', 'Choice'];
      stream = new Util.Stream(subjects);
      jitter = new Jitter(stream);
      ui = new UI(stream, jitter.onReady);
      Util.noop(ui);
    });
  }

  constructor(stream1) {
    this.onReady = this.onReady.bind(this);
    this.stream = stream1;
    this.content = {};
    this.view = null; // Set by onReady()
    this.spec = null; // Set by onReady()
    this.flavor = new Jitter.Flavor(this.stream, this);
    this.choices = new Jitter.Choices(this.stream, this);
    this.roast = new Jitter.Roast(this.stream, this);
    this.drink = new Jitter.Drink(this.stream, this);
    this.body = new Jitter.Body(this.stream, this);
    this.brew = new Jitter.Brew(this.stream, this);
  }

  addContent(name, object) {
    return this.content[name] = object;
  }

  onReady(view, spec) {
    var content, i, len, pane, ref;
    this.view = view;
    this.spec = spec;
    ref = this.view.panes;
    for (i = 0, len = ref.length; i < len; i++) {
      pane = ref[i];
      content = this.content[pane.name];
      content.pane = pane;
      content.spec = spec[pane.name];
      content.$pane = content.readyPane();
      content.$view = $(); // For now view content is not used
      content.pane.$.append(content.$pane);
    }
  }

  onSelect(pane, select) {
    UI.verifySelect(select, 'Jitter');
    switch (select.intent) {
      case UI.SelectView:
        this.selectView(pane);
        break;
      case UI.SelectPane:
        this.selectPane(pane);
        break;
      case UI.SelectStudy:
        this.selectStudy(pane, select.study);
        break;
      default:
        Util.error("Jitter.onSelect() unknown select", select);
    }
  }

  selectView(pane) {
    var content;
    content = this.content[pane.name];
    if (UI.isEmpty(content.$view)) {
      content.$view = content.readyView();
      content.pane.$.append(content.$view);
    }
    content.$pane.hide();
    content.$view.show();
    console.log('Jitter.selectView()', pane.name);
  }

  selectPane(pane) {
    var content;
    content = this.content[pane.name];
    if (UI.isEmpty(content.$pane)) {
      content.$pane = content.readyPane();
      if (UI.isEmpty(content.$pane)) {
        content.pane.$.append($pane);
      }
    }
    content.$view.hide();
    content.$pane.show();
    console.log('Jitter.selectPane()', pane.name);
  }

  // Study scenarios have not yet been implemented
  selectStudy(pane, study) {
    var content;
    content = this.content[pane.name];
    content.$view.hide();
    content.$pane.show();
    return console.log('Jitter.selectStudy()', pane.name, study.name);
  }

};
