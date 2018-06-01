import Util from '../util/Util.js';
import UI   from '../ui/UI.js';
import Dom  from '../ui/Dom.js';
var Summary;

Summary = class Summary {
  constructor(stream, ui, name) {
    this.readyPane = this.readyPane.bind(this);
    this.readyView = this.readyView.bind(this);
    this.onRegion = this.onRegion.bind(this);
    this.onChoice = this.onChoice.bind(this);
    this.stream = stream;
    this.ui = ui;
    this.name = name;
    this.ui.addContent(this.name, this);
    this.btns = {};
    this.flavors = [];
  }

  readyPane() {
    this.$pane = Dom.tree(this.stream, this.spec, 'Summary', this, 6, 13);
    this.subscribe();
    return this.$pane;
  }

  readyView() {
    return $("<h1 style=\" display:grid; justify-self:center; align-self:center; \">Summary</h1>");
  }

  subscribe() {
    if (this.name === "Summarym") {
      this.stream.subscribe('Region', this.name, (region) => {
        return this.onRegion(region);
      });
    }
    this.stream.subscribe('Choice', this.name, (choice) => {
      return this.onChoice(choice);
    });
  }

  onRegion(region) {
    var choice, flavor, i, j, len, len1, ref, ref1;
    ref = this.flavors;
    for (i = 0, len = ref.length; i < len; i++) {
      flavor = ref[i];
      choice = UI.toTopic("Flavor", 'Summary', UI.DelChoice, flavor);
      this.onChoice(choice);
    }
    if ((region != null) && (region.flavors != null)) {
      ref1 = region.flavors;
      for (j = 0, len1 = ref1.length; j < len1; j++) {
        flavor = ref1[j];
        choice = UI.toTopic("Flavor", 'Summary', UI.AddChoice, flavor);
        this.onChoice(choice);
      }
      return this.flavors = region.flavors;
    }
  }

  onChoice(choice) {
    var $e, htmlId, specStudy;
    specStudy = this.spec[choice.name];
    if (specStudy == null) {
      return;
    }
    if (this.stream.isInfo('Choice') && this.name === "Summaryp") {
      console.info('Summary.onChoice()', choice);
    }
    htmlId = Util.getHtmlId(choice.name, 'Choice', choice.study);
    $e = this.btns[choice.name].$e;
    if (choice.intent === UI.AddChoice) {
      $e.append(`<div id="${htmlId}" style="color:yellow; padding-left:12px; font-size:12px; line-height:14px;">${Util.toName(choice.study)}</div>`);
    } else {
      $e.find('#' + htmlId).remove();
    }
  }

};

export default Summary;
