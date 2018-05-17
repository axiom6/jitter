import UI   from '../ui/UI.js';
import Dom  from '../ui/Dom.js';
var Summary,
  hasProp = {}.hasOwnProperty;

Summary = class Summary {
  constructor(stream, ui, name, jitter = null) {
    this.readyPane = this.readyPane.bind(this);
    this.readyView = this.readyView.bind(this);
    this.onRegion = this.onRegion.bind(this);
    this.onChoice = this.onChoice.bind(this);
    // Tests can be initiated after all ready() call have completed
    this.onTest = this.onTest.bind(this);
    // Publish all preference choices
    this.onPrefs = this.onPrefs.bind(this);
    this.stream = stream;
    this.ui = ui;
    this.name = name;
    this.jitter = jitter;
    this.ui.addContent(this.name, this);
    this.btns = {};
    this.flavors = [];
  }

  readyPane() {
    this.$pane = Dom.tree(this.stream, this.spec, this, 6, 13);
    this.subscribe();
    return this.$pane;
  }

  readyView() {
    return $("<h1 style=\" display:grid; justify-self:center; align-self:center; \">Summary</h1>");
  }

  subscribe() {
    if (this.jitter != null) {
      this.stream.subscribe('Prefs', 'Summary', (prefs) => {
        return this.onPrefs(prefs);
      });
    }
    if (this.jitter != null) {
      this.stream.subscribe('Test', 'Summary', (test) => {
        return this.onTest(test);
      });
    }
    if (this.name === "Summaryf") {
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
      choice = UI.select("Flavor", 'Summary', UI.DelChoice, flavor);
      this.onChoice(choice);
    }
    if ((region != null) && (region.flavors != null)) {
      ref1 = region.flavors;
      for (j = 0, len1 = ref1.length; j < len1; j++) {
        flavor = ref1[j];
        choice = UI.select("Flavor", 'Summary', UI.AddChoice, flavor);
        this.onChoice(choice);
      }
      return this.flavors = region.flavors;
    }
  }

  onChoice(choice) {
    var $e, htmlId, specStudy, value;
    specStudy = this.spec[choice.name];
    if (specStudy == null) { // or choice.source is 'Summary'
      return;
    }
    if ((this.jitter != null) && this.stream.isInfo('Choice')) {
      console.info('Summary.onChoice()', choice);
    }
    htmlId = this.ui.getHtmlId(choice.name, 'Choice', choice.study);
    value = choice.value != null ? ":" + choice.value : "";
    $e = this.btns[choice.name].$e;
    if (choice.intent === UI.AddChoice) {
      $e.append(`<div id="${htmlId}" style="color:yellow; padding-left:12px; font-size:12px; line-height:14px;">${choice.study + value}</div>`);
    } else {
      $e.find('#' + htmlId).remove();
    }
  }

  onTest(test) {
    if (test === 'Prefs') {
      this.onPrefs(this.testPrefs());
    }
  }

  onPrefs(prefs) {
    var array, chc, choice, i, key, len, ref;
    if (this.jitter == null) { // Insure that only the primary summary publishes choices
      return;
    }
    if (this.stream.isInfo('Prefs')) {
      console.info('Summary.onPrefs()', prefs);
    }
    ref = prefs.choices;
    for (key in ref) {
      if (!hasProp.call(ref, key)) continue;
      array = ref[key];
      for (i = 0, len = array.length; i < len; i++) {
        chc = array[i];
        choice = UI.select(key, 'Summary', UI.AddChoice, chc);
        this.stream.publish('Choice', choice);
      }
    }
  }

  initPrefs() {
    var prefs;
    prefs = {};
    prefs.id = '';
    prefs.name = '';
    prefs.email = '';
    prefs.choices = {
      Region: [],
      Flavor: [],
      Roast: [],
      Brew: [],
      Drink: [],
      Body: []
    };
    return prefs;
  }

  testPrefs() {
    var prefs;
    prefs = {};
    prefs.id = '1';
    prefs.name = 'Human Made';
    prefs.email = 'customer@gmail.com';
    prefs.choices = {
      Region: ['Brazil'],
      Flavor: ['Chocolate', 'Nutty'],
      Roast: ['Medium'],
      Brew: ['AutoDrip'],
      Drink: ['Black'],
      Body: ['Full']
    };
    return prefs;
  }

  prefsToSchema(prefs) {
    var schema;
    schema = {};
    schema.id = prefs.id;
    schema.name = prefs.name;
    schema.meta = this.choicesToMetas(prefs.choices);
    return schema;
  }

  schemaToPrefs(schema) {
    var prefs;
    prefs = {};
    prefs.id = schema.id;
    prefs.name = schema.name;
    prefs.choices = this.metasToChoices(schema.meta);
    prefs.schema = schema; // For reviewing data
    return prefs;
  }

  metasToChoices(metas) {
    var choices, i, len, meta;
    choices = {};
    for (i = 0, len = metas.length; i < len; i++) {
      meta = metas[i];
      choices[meta.key] = meta.key;
    }
    return choices;
  }

  choicesToMetas(choices) {
    var choice, key, metas;
    metas = [];
    for (key in choices) {
      if (!hasProp.call(choices, key)) continue;
      choice = choices[key];
      metas.push({
        key: choice
      });
    }
    return metas;
  }

};

export default Summary;
