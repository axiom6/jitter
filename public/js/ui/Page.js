import Util   from '../util/Util.js';
import UI     from '../ui/UI.js';
import Btn    from '../ui/Btn.js';
var Page,
  hasProp = {}.hasOwnProperty;

Page = class Page {
  constructor(ui, stream, view, pane) {
    // Called by layout and Btn
    this.onContent = this.onContent.bind(this);
    this.ui = ui;
    this.stream = stream;
    this.view = view;
    this.pane = pane;
    this.spec = this.pane.spec;
    this.name = this.pane.name;
    if (this.name === 'None') {
      console.log('new Page() name is None');
      console.trace();
    }
    this.icon = this.spec.icon;
    if (UI.hasPage) {
      //@connect    = new Connect( @ui, @stream, @view, @, @spec   )
      this.contents = this.ui.prac.initContents();
      this.choice = "";
      this.intent = "";
      this.saveHtml = false;
      this.saveSvg = false;
      this.showBtn = false;
    }
  }

  //@btn         = new Btn( @ui, @stream, @pane, @pane.spec, @viewer.contents ) if @showBtn
  ready() {
    this.subscribe();
    if (this.showBtn) {
      //@connect.ready()
      this.btn.ready();
    }
  }

  subscribe() {
    this.stream.subscribe('Content', 'Page' + this.name, (content) => {
      return this.onContent(content);
    });
  }

  publish($on) {
    var select;
    if (this.ui.isElem($on)) {
      select = UI.select(Util.toSelect(this.pane.name), 'Page', UI.SelectPane);
      this.stream.publish('Select', select, $on, 'click');
    }
  }

  publishJQueryObjects(objects, intent) {
    var $object, name, select;
    if (true) {
      return;
    }
    for (name in objects) {
      $object = objects[name];
      if (!(this.ui.isElem($object))) {
        continue;
      }
      select = UI.select(Util.toSelect(name), 'Page', intent);
      if (this.stream.isInfo('Select')) {
        console.info('Page.publishJQueryObjects()');
      }
      this.stream.publish('Select', select, $object, 'click');
    }
  }

  // Convert select message to content Called by pane.onSelect
  onSelect(select) {
    var choice, content;
    if (!UI.verifySelect(select, "Page.onSelect()")) {
      return;
    }
    choice = this.choiceOnSelect(); // select
    if (this.stream.isInfo('Select')) {
      console.info('Page.onSelect()', {
        name: this.name,
        plane: this.ui.planeName,
        select: select
      });
    }
    content = UI.content(choice, select.source, select.intent, select.name);
    this.onContent(content);
  }

  choiceOnSelect() {
    if (this.pane.lastChoice !== 'None') {
      return this.pane.lastChoice;
    } else {
      return 'Study';
    }
  }

  onContent(content) {
    var app, choice, intent, ready;
    content.name = this.name;
    if (this.stream.isInfo('Content')) {
      console.info('Page.onContent()', {
        name: this.name,
        plane: this.ui.planeName,
        content: content
      });
    }
    choice = content.choice;
    intent = content.intent;
    if (!UI.verifyContent(content, "Page.onContent()")) {
      return;
    }
    ready = this.choice !== choice && Util.isObjEmpty(this.contents[choice]) && UI.hasPage;
    if (Util.isStr(this.choice)) {
      this.contents[this.choice].$.hide();
    }
    if (ready) {
      this.contents[choice] = this.ui.prac.createContent(choice, this.pane, this);
      this.contents[choice].ready();
    }
    //console.log( 'onContent()', { choice:choice, empty:Util.isObjEmpty(@contents[choice]), content:@contents[choice] } )
    app = this.contents[choice];
    app.layout();
    app.$.show();
    this.choice = choice;
    this.intent = intent;
    if (this.choice === 'Graph' && this.saveSvg) {
      app.saveSvg();
      this.saveSvg = false;
    }
    if (this.choice === 'Study' && this.saveHtml) {
      app.saveHtml();
      this.saveHtml = false;
    }
  }

  getStudy(name) {
    var key, ref, study;
    ref = this.spec.studies;
    for (key in ref) {
      if (!hasProp.call(ref, key)) continue;
      study = ref[key];
      if (name !== 'None') {
        if (key === name) {
          return study;
        }
      }
    }
    return 'None';
  }

};

export default Page;
