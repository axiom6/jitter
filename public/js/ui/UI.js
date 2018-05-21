import Util from '../util/Util.js';
import Navb from '../ui/Navb.js';
import Tocs from '../ui/Tocs.js';
import View from '../ui/View.js';
var UI,
  hasProp = {}.hasOwnProperty;

UI = (function() {
  class UI {
    constructor(stream, jsonPath, planeName, navbs = null, prac = null) {
      var callback;
      this.resize = this.resize.bind(this);
      this.contentReady = this.contentReady.bind(this);
      this.stream = stream;
      this.jsonPath = jsonPath;
      this.planeName = planeName;
      this.navbs = navbs;
      this.prac = prac;
      this.contents = {};
      callback = (data) => {
        this.specs = this.createSpecs(data);
        if (this.navbs != null) {
          this.navb = new Navb(this, this.stream, this.navbs);
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

    createSpecs(data) {
      var specs;
      this.nrowncol(data);
      specs = UI.hasPack ? this.createPacks(data) : this.createPracs(data);
      if (this.stream.infoSpec.subscribe && this.stream.isInfo('Select')) {
        console.info('UI.createSpecs()', {
          pack: UI.hasPack,
          specs
        });
      }
      return specs;
    }

    createPacks(data) {
      var gkey, pack;
      for (gkey in data) {
        pack = data[gkey];
        if (!(UI.isChild(gkey))) {
          continue;
        }
        pack['name'] = gkey;
        data[gkey] = pack;
        pack.practices = {};
        this.createPracs(pack);
      }
      return data;
    }

    createPracs(data) {
      var ikey, item, pkey, practice, skey, study, tkey, topic;
      for (pkey in data) {
        practice = data[pkey];
        if (!(UI.isChild(pkey))) {
          continue;
        }
        practice['name'] = pkey;
        practice.studies = {};
        if (data.practices != null) {
          data.practices[pkey] = practice;
        }
        for (skey in practice) {
          study = practice[skey];
          if (!(UI.isChild(skey))) {
            continue;
          }
          study['name'] = skey;
          study.topics = {};
          practice.studies[skey] = study;
          for (tkey in study) {
            topic = study[tkey];
            if (!(UI.isChild(tkey))) {
              continue;
            }
            topic['name'] = tkey;
            topic.items = {};
            study.topics[tkey] = topic;
            for (ikey in topic) {
              item = topic[ikey];
              if (!(UI.isChild(ikey))) {
                continue;
              }
              item['name'] = ikey;
              topic.items[ikey] = item;
            }
          }
        }
      }
      return data;
    }

    nrowncol(data) {
      UI.nrow = data.nrow != null ? data.nrow : UI.nrow;
      return UI.ncol = data.ncol != null ? data.ncol : UI.ncol;
    }

    html() {
      var htm;
      htm = "";
      if (UI.hasLays) {
        htm += `<div class="layout-logo     " id="${this.htmlId('Logo')}"></div>`;
      }
      if (UI.hasLays || (this.navbs != null)) {
        htm += `<div class="layout-corp"      id="${this.htmlId('Corp')}"></div>`;
      }
      if (UI.hasLays) {
        htm += `<div class="layout-find"      id="${this.htmlId('Find')}"></div>`;
      }
      if (UI.hasTocs) {
        htm += `<div class="layout-tocs tocs" id="${this.htmlId('Tocs')}"></div>`;
      }
      htm += `<div class="layout-view"      id="${this.htmlId('View')}"></div>`;
      if (UI.hasLays) {
        htm += `<div class="layout-side"      id="${this.htmlId('Side')}"></div>`;
      }
      if (UI.hasLays) {
        htm += `<div class="layout-pref     " id="${this.htmlId('Pref')}"></div>`;
      }
      if (UI.hasLays) {
        htm += `<div class="layout-foot"      id="${this.htmlId('Foot')}"></div>`;
      }
      if (UI.hasLays) {
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
      this.contents[name] = object;
    }

    ready() {
      var content, ready;
      $('#' + this.htmlId('App')).html(this.html());
      if (this.navbs != null) {
        this.navb.ready();
      }
      if (UI.hasTocs) {
        this.tocs.ready();
      }
      this.view.ready();
      //contentReady() called by Ready subscribers
      if (UI.hasPage) {
        content = UI.content('Study', 'UI');
        this.stream.publish('Content', content);
      } else {
        ready = UI.select("Ready", "UI", UI.SelectView); // UI.SelectView is a placeholder since Ready does not have intents
        this.stream.publish("Ready", ready);
      }
    }

    contentReady() {
      var content, name, ref;
      ref = this.contents;
      for (name in ref) {
        if (!hasProp.call(ref, name)) continue;
        content = ref[name];
        content.pane = this.view.getPane(name);
        content.spec = content.pane.spec;
        content.$pane = content.readyPane();
        content.$view = content.readyView();
        content.isSvg = this.isElem(content.$pane.find('svg'));
        if (!content.isSvg) {
          content.pane.$.append(content.$pane);
        }
      }
    }

    onSelect(pane, select) {
      UI.verifySelect(select, 'UI');
      switch (select.intent) {
        case UI.SelectView:
          this.selectView(pane);
          break;
        case UI.SelectPack:
          this.selectPack(pane);
          break;
        case UI.SelectPane:
          this.selectPane(pane);
          break;
        case UI.SelectStudy:
          this.selectStudy(pane, select.study);
          break;
        default:
          console.error("UI.onSelect() unknown select", select);
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
        console.info('UI.selectView()', pane.name);
      }
    }

    selectPack(pane) {
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
        console.info('UI.selectPack()', pane.name);
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
        console.info('UI.selectPane()', pane.name);
      }
    }

    // Study scenarios have not yet been implemented
    selectStudy(pane, study) {
      var content;
      content = this.content[pane.name];
      content.$view.hide();
      content.$pane.show();
      if (this.stream.isInfo('Select')) {
        return console.info('UI.selectStudy()', pane.name, study.name);
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
        name: name,
        source: source,
        choice: choice
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
        return UI.local;
      } else {
        return UI.hosted;
      }
    }

  };

  UI.hasPack = true;

  UI.hasPage = true;

  UI.hasTocs = true;

  UI.hasLays = true;

  UI.local = "http://localhost:63342/ui/public/"; // Every app needs to change this

  UI.hosted = "https://jitter-48413.firebaseapp.com/"; // Every app needs to change this

  UI.$empty = $();

  UI.ncol = 36;

  UI.nrow = 36;

  //I.margin  =  { width:1,    height:1,    west:2,   north :1, east :2,   south 2, wStudy:0.5, hStudy:0.5 }
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

  UI.SelectPack = 'SelectPack';

  UI.AddChoice = 'AddChoice';

  UI.DelChoice = 'DelChoice';

  UI.intents = [UI.SelectPane, UI.SelectView, UI.SelectStudy, UI.SelectRow, UI.SelectCol, UI.SelectPack, UI.AddChoice, UI.DelChoice];

  return UI;

}).call(this);

export default UI;
