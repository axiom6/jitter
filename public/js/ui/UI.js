import Util from '../util/Util.js';
import Navb from '../ui/Navb.js';
import Tocs from '../ui/Tocs.js';
import View from '../ui/View.js';
var UI,
  hasProp = {}.hasOwnProperty;

UI = (function() {
  class UI {
    constructor(stream, jsonPath, navbSpecs = null, prac = null) {
      var callback;
      this.resize = this.resize.bind(this);
      this.contentReady = this.contentReady.bind(this);
      this.stream = stream;
      this.jsonPath = jsonPath;
      this.navbSpecs = navbSpecs;
      this.prac = prac;
      this.contents = {};
      this.planeName = this.setupPlane();
      callback = (data) => {
        this.specs = this.prac != null ? this.processPractices(data) : data;
        if (this.navbSpecs != null) {
          this.navb = new Navb(this, this.stream, this.navbSpecs);
        }
        if (UI.hasTocs) {
          this.tocs = new Tocs(this, this.stream, this.specs);
        }
        this.view = new View(this, this.stream, this.specs);
        return this.ready();
      };
      UI.readJSON(this.jsonPath, callback);
      UI.ui = this;
    }

    setupPlane() {
      if (this.prac != null) {
        return this.prac.planeName;
      } else if (this.jsonPath === "json/toc.json") {
        if (this.stream.isInfo('Plane')) {
          console.info("UI.setupPlane() Jitter");
        }
        UI.hasPage = false;
        UI.hasTocs = false;
        UI.hasPictFrame = false;
        this.nrow = 36;
        this.ncol = 36;
        return 'Jitter';
      } else {
        return 'None';
      }
    }

    processPractices(data) {
      this.nrowncol(data);
      return this.prac.createFilteredPractices(data);
    }

    nrowncol(data) {
      this.nrow = data.nrow != null ? data.nrow : UI.nrow;
      return this.ncol = data.ncol != null ? data.ncol : UI.ncol;
    }

    // This method detects if  ui instances have not unsubscribed for planes other than the current build plane
    // are still receiving messages that can generate exceptions
    inPlane(source) {
      if ((this.prac != null) && this.prac.planeName !== this.planeName) {
        console.log("UI.inPlane() not in", {
          currentPlane: this.prac.planeName,
          uiPlane: this.planeName,
          source: source
        });
        if (this.stream) {
          console.trace();
        }
        return false;
      } else {
        return true;
      }
    }

    html() {
      var htm;
      htm = "";
      if (UI.hasPictFrame) {
        htm += `<div class="layout-logo     " id="${this.htmlId('Logo')}"></div>`;
      }
      if (this.navbSpecs != null) {
        htm += `<div class="layout-corp"      id="${this.htmlId('Corp')}"></div>`;
      }
      if (UI.hasPictFrame) {
        htm += `<div class="layout-find"      id="${this.htmlId('Find')}"></div>`;
      }
      if (UI.hasPictFrame) {
        htm += `<div class="layout-tocs tocs" id="${this.htmlId('Tocs')}"></div>`;
      }
      htm += `<div class="layout-view"      id="${this.htmlId('View')}"></div>`;
      if (UI.hasPictFrame) {
        htm += `<div class="layout-side"      id="${this.htmlId('Side')}"></div>`;
      }
      if (UI.hasPictFrame) {
        htm += `<div class="layout-pref     " id="${this.htmlId('Pref')}"></div>`;
      }
      if (UI.hasPictFrame) {
        htm += `<div class="layout-foot"      id="${this.htmlId('Foot')}"></div>`;
      }
      if (UI.hasPictFrame) {
        htm += `<div class="layout-trak"      id="${this.htmlId('Trak')}"></div>`;
      }
      return htm;
    }

    show() {
      if (UI.hasTocs) {
        this.tocs.show();
      }
      this.view.showAll();
    }

    hide() {
      if (UI.hasTocs) {
        this.tocs.hide();
      }
      this.view.hideAll();
    }

    resize() {
      this.view.resize();
    }

    addContent(name, object) {
      return this.contents[name] = object;
    }

    ready() {
      var content, prefs, select;
      $('#' + this.htmlId('App')).html(this.html());
      if (this.navbSpecs != null) {
        this.navb.ready();
      }
      if (UI.hasTocs) {
        this.tocs.ready();
      }
      this.view.ready();
      this.contentReady();
      if (this.planeName === 'Jitter') {
        this.view.hideAll('Interact');
        select = UI.select('Maps', 'UI', UI.SelectGroup);
        this.stream.publish('Select', select);
        prefs = () => {
          return this.stream.publish('Test', 'Prefs'); // Here is a good place start test a the end of ready()
        };
        setTimeout(prefs, 3000);
      } else {
        content = UI.content('Study', 'UI');
        this.stream.publish('Content', content);
      }
    }

    contentReady() {
      var content, name, ref;
      ref = this.contents;
      for (name in ref) {
        if (!hasProp.call(ref, name)) continue;
        content = ref[name];
        content.pane = this.view.getPaneOrGroup(name);
        content.spec = content.pane.spec; // specs[name]
        content.$pane = content.readyPane();
        content.$view = $(); // content.readView() For now view content is not used
        content.pane.$.append(content.$pane);
      }
    }

    //console.log( 'UI.contentReady()', { name:name, spec:content.pane.spec } )
    onSelect(pane, select) {
      UI.verifySelect(select, 'Jitter');
      switch (select.intent) {
        case UI.SelectView:
          this.selectView(pane);
          break;
        case UI.SelectGroup:
          this.selectGroup(pane);
          break;
        case UI.SelectPane:
          this.selectPane(pane);
          break;
        case UI.SelectStudy:
          this.selectStudy(pane, select.study);
          break;
        default:
          console.error("Jitter.onSelect() unknown select", select);
      }
    }

    selectView(pane) {
      var content;
      content = this.content[pane.name];
      if (this.isEmpty(content.$view)) {
        content.$view = content.readyView();
        content.pane.$.append(content.$view);
      }
      content.$pane.hide();
      content.$view.show();
      if (this.stream.isInfo('Select')) {
        console.info('Jitter.selectView()', pane.name);
      }
    }

    selectGroup(pane) {
      var content;
      content = this.content[pane.name];
      if (this.isEmpty(content.$pane)) {
        content.$pane = content.readyPane();
        if (this.isEmpty(content.$pane)) {
          content.pane.$.append($pane);
        }
      }
      content.$view.hide();
      content.$pane.show();
      if (this.stream.isInfo('Select')) {
        console.info('Jitter.selectGroup()', pane.name);
      }
    }

    selectPane(pane) {
      var content;
      content = this.content[pane.name];
      if (this.isEmpty(content.$pane)) {
        content.$pane = content.readyPane();
        if (this.isEmpty(content.$pane)) {
          content.pane.$.append($pane);
        }
      }
      content.$view.hide();
      content.$pane.show();
      if (this.stream.isInfo('Select')) {
        console.info('Jitter.selectPane()', pane.name);
      }
    }

    // Study scenarios have not yet been implemented
    selectStudy(pane, study) {
      var content;
      content = this.content[pane.name];
      content.$view.hide();
      content.$pane.show();
      if (this.stream.isInfo('Select')) {
        return console.info('Jitter.selectStudy()', pane.name, study.name);
      }
    }

    // Html and jQuery Utilities in UI because it is passed around everywhere
    htmlId(name, type = '', ext = '') {
      return Util.htmlId(name, type, ext);
    }

    getHtmlId(name, ext = '') {
      return Util.getHtmlId(name, "", ext);
    }

    isEmpty($elem) {
      return ($elem != null) && ($elem.length != null) && $elem.length === 0;
    }

    isElem($elem) {
      return ($elem != null) && ($elem.length != null) && $elem.length > 0;
    }

    static jQueryHasNotBeenLoaded() {
      if (typeof jQuery === 'undefined') {
        console.error('UI JQuery has not been loaded');
        return true;
      } else {
        return false;
      }
    }

    static readJSON(url, callback) {
      var settings;
      if (UI.jQueryHasNotBeenLoaded()) {
        return;
      }
      url = UI.baseUrl() + url;
      settings = {
        url: url,
        type: 'GET',
        dataType: 'json',
        processData: false,
        contentType: 'application/json',
        accepts: 'application/json'
      };
      settings.success = (data, status, jqXHR) => {
        Util.noop(status, jqXHR);
        return callback(data);
      };
      settings.error = (jqXHR, status, error) => {
        Util.noop(jqXHR);
        return console.error("UI.readJSON()", {
          url: url,
          status: status,
          error: error
        });
      };
      $.ajax(settings);
    }

    static isChild(key) {
      var a;
      a = key.charAt(0);
      return a === a.toUpperCase() && a !== '$';
    }

    static select(name, source, intent, study = null) {
      var obj;
      obj = {
        name: name,
        source: source,
        intent: intent,
        study: study
      };
      UI.verifySelect(obj, "UI.select()");
      return obj;
    }

    static content(choice, source, name = 'None') {
      var content;
      // console.log( 'UI.content()', { content:choice, source:source, name:name } )
      content = {
        choice: choice,
        source: source,
        name: name
      };
      UI.verifyContent(content, "UI.content()");
      return content;
    }

    static verifySelect(select, source) {
      var verify;
      verify = Util.isStr(select.name) && Util.isStr(select.source) && Util.inArray(UI.intents, select.intent);
      if (!verify) {
        console.log('UI.verifySelect()', {
          select: select,
          source: source
        });
        console.trace();
      }
      return verify;
    }

    static verifyContent(content, source) {
      var verify;
      verify = Util.isStr(content.name) && Util.isStr(content.choice) && Util.isStr(content.source);
      if (!verify) {
        console.log('UI.verifyContent()', {
          content: content,
          source: source
        });
        console.trace();
      }
      return verify;
    }

    static baseUrl() {
      if (window.location.href.includes('localhost')) {
        return "http://localhost:63342/jitter/public/";
      } else {
        return "https://jitter-48413.firebaseapp.com/";
      }
    }

  };

  UI.hasPage = true;

  UI.hasTocs = true;

  UI.hasPictFrame = true;

  UI.$empty = $();

  UI.ncol = 36;

  UI.nrow = 36;

  //I.margin =  { width:1,    height:1,    west:2,   north :1, east :2,   south 2, wStudy:0.5, hStudy:0.5 }
  UI.margin = {
    width: 0.00,
    height: 0.00,
    west: 0.5,
    north: 0,
    east: 0.5,
    south: 0,
    wStudy: 0.5,
    hStudy: 0.5
  };

  UI.SelectView = 'SelectView';

  UI.SelectPane = 'SelectPane';

  UI.SelectStudy = 'SelectStudy';

  UI.SelectTopic = 'SelectTopic';

  UI.SelectItems = 'SelectItems';

  UI.SelectRow = 'SelectRow';

  UI.SelectCol = 'SelectCol';

  UI.SelectGroup = 'SelectGroup';

  UI.AddChoice = 'AddChoice';

  UI.DelChoice = 'DelChoice';

  UI.intents = [UI.SelectPane, UI.SelectView, UI.SelectStudy, UI.SelectRow, UI.SelectCol, UI.SelectGroup, UI.AddChoice, UI.DelChoice];

  return UI;

}).call(this);

export default UI;
