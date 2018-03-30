var UI,
  hasProp = {}.hasOwnProperty;

UI = (function() {
  class UI {
    constructor(stream) {
      var callback;
      this.contentReady = this.contentReady.bind(this);
      this.resize = this.resize.bind(this);
      this.stream = stream;
      this.contents = {};
      callback = (data) => {
        this.spec = data;
        if (UI.hasTocs) {
          this.tocs = new UI.Tocs(this, this.stream, this.spec);
        }
        this.view = new UI.View(this, this.stream, this.spec);
        return this.ready(this.spec);
      };
      UI.readJSON("json/toc.json", callback);
      UI.ui = this;
    }

    addContent(name, object) {
      return this.contents[name] = object;
    }

    ready(spec) {
      this.spec = spec;
      $('#' + Util.htmlId('App')).html(this.html());
      if (UI.hasTocs) {
        this.tocs.ready();
      }
      this.view.ready();
      this.contentReady();
    }

    contentReady() {
      var content, name, ref;
      ref = this.contents;
      for (name in ref) {
        if (!hasProp.call(ref, name)) continue;
        content = ref[name];
        content.pane = this.view.getPaneOrGroup(name);
        content.spec = this.spec[name];
        content.$pane = content.readyPane();
        content.$view = $(); // content.readView() For now view content is not used
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

    html() {
      var htm;
      htm = "";
      if (UI.hasTocs) {
        htm += `<div class="layout-tocs tocs" id="${this.htmlId('Tocs')}"></div>`;
      }
      htm += `<div class="layout-view" id="${this.htmlId('View')}"></div>`;
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

    htmlId(name, type = '', ext = '') {
      return Util.htmlId(name, type, ext);
    }

    getHtmlId(name, ext = '') {
      return Util.getHtmlId(name, "", ext);
    }

    static baseUrl() {
      if (window.location.href.includes('localhost')) {
        return "http://localhost:63342/jitter/public/";
      } else {
        return "https://jitter-48413.firebaseapp.com/";
      }
    }

    static readJSON(url, callback) {
      var settings;
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
        return Util.error("UI.readJSON()", {
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
      UI.verifySelect(obj);
      return obj;
    }

    static verifySelect(select, source) {
      var verify;
      verify = Util.isStr(select.name) && Util.isStr(select.source) && Util.inArray(UI.intents, select.intent);
      if (!verify) {
        Util.trace('UI.verifySelect()', select, source);
      }
      return verify;
    }

    static isEmpty($elem) {
      return ($elem != null) && ($elem.length != null) && $elem.length === 0;
    }

    static isElem($elem) {
      return !UI.isEmpty($elem);
    }

    static jmin(cells) {
      if (cells == null) {
        Util.trace('UI.jmin');
      }
      return [cells[0] - 1, cells[1], cells[2] - 1, cells[3]];
    }

    static toCells(jmin) {
      return [jmin[0] + 1, jmin[1], jmin[2] + 1, jmin[3]];
    }

    static unionCells(cells1, cells2) {
      var i1, i2, j1, j2, m1, m2, n1, n2;
      [j1, m1, i1, n1] = UI.jmin(cells1);
      [j2, m2, i2, n2] = UI.jmin(cells2);
      return [Math.min(j1, j2) + 1, Math.max(j1 + m1, j2 + m2) - Math.min(j1, j2), Math.min(i1, i2) + 1, Math.max(i1 + n1, i2 + n2) - Math.min(i1, i2)];
    }

    static intersectCells(cells1, cells2) {
      var i1, i2, j1, j2, m1, m2, n1, n2;
      [j1, m1, i1, n1] = UI.jmin(cells1);
      [j2, m2, i2, n2] = UI.jmin(cells2);
      return [Math.max(j1, j2) + 1, Math.min(j1 + m1, j2 + m2), Math.max(i1, i2) + 1, Math.min(i1 + n1, i2 + n2)];
    }

  };

  UI.hasTocs = false;

  UI.$empty = $(); // Empty jQuery singleton for intialization

  UI.None = "None";

  UI.ncol = 36;

  UI.nrow = 36;

  UI.margin = {
    width: 1,
    height: 1,
    west: 2,
    north: 1,
    east: 2,
    south: 2,
    wStudy: 0.5,
    hStudy: 0.5
  };

  UI.SelectView = 'SelectView';

  UI.SelectPane = 'SelectPane';

  UI.SelectStudy = 'SelectStudy';

  UI.AddChoice = 'AddChoice';

  UI.DelChoice = 'DelChoice';

  UI.intents = [UI.SelectPane, UI.SelectView, UI.SelectStudy, UI.AddChoice, UI.DelChoice];

  return UI;

}).call(this);
