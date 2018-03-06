// $ = require('jquery')
var UI;

UI = (function() {
  class UI {
    constructor(stream, page) {
      var callback;
      this.resize = this.resize.bind(this);
      this.stream = stream;
      this.page = page;
      callback = (data) => {
        this.spec = data;
        this.tocs = new UI.Tocs(this, this.stream, this.spec);
        this.view = new UI.View(this, this.stream, this.spec);
        return this.ready(this.page, this.spec);
      };
      UI.readJSON("json/toc.json", callback);
      UI.ui = this;
    }

    ready(page, spec) {
      this.page = page;
      this.spec = spec;
      $('#' + Util.htmlId('App')).html(this.html());
      this.tocs.ready();
      this.view.ready();
      this.page.ready(this.view, this.spec);
    }

    html() {
      return `<div   class="ikw-logo" id="${this.htmlId('Logo')}"></div>\n<div   class="ikw-corp" id="${this.htmlId('Corp')}">\n  <div id="${this.htmlId('Navb')}"></div>\n</div>\n<div   class="ikw-find" id="${this.htmlId('Find')}"></div>\n<div   class="ikw-tocs tocs" id="${this.htmlId('Tocs')}"></div>\n<div   class="ikw-view" id="${this.htmlId('View')}">\n  <i id="${this.htmlId('Togg')}" class="fa fa-compress ikw-togg"></i>\n</div>\n<div class="ikw-side" id="${this.htmlId('Side')}"></div>\n<div class="ikw-pref" id="${this.htmlId('Pref')}"><a id="${this.htmlId('ImageLink')}"></a></div>\n<div class="ikw-foot" id="${this.htmlId('Foot')}"></div>\n<div class="ikw-trak" id="${this.htmlId('Trak')}"></div>`;
    }

    show() {
      this.tocs.show();
      this.view.showAll();
    }

    hide() {
      this.tocs.hide();
      this.view.hideAll();
    }

    resize() {
      this.view.resize();
    }

    htmlId(name, type = '', ext = '') {
      return Util.htmlId(name, type, ext);
    }

    notInPlane() {
      return false;
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

    /*
    Error: Page.selectContent() unknown select { name:"", source:Tocs, intent:undefined }
    Error: UI.Tocs.getSpec(id) spec null for select { name:"", source:Tocs, intent:undefined }
    Error: UI.View.onSelect() name not processed for intent "" undefined
    */
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

    static subscribe() {}

    //UI.TheStream.subscribe( 'Plane', (name) => UI.onPlane(name) )  # if not UI.Build? # Subscribe only when ui.ready()
    //UI.TheStream.subscribe( 'Image', (name) => UI.onImage(name) )
    static publish() {}

  };

  //Util.UI        = UI
  //module.exports = UI
  //UI.Tocs        = require( 'js/ui/Tocs'    )
  //UI.View        = require( 'js/ui/View'    )
  //UI.Pane        = require( 'js/ui/Pane'    )
  UI.$empty = $(); // Empty jQuery singleton for intialization

  UI.None = "None";

  UI.ncol = 36;

  UI.nrow = 24;

  UI.margin = {
    width: 1,
    height: 1,
    west: 5,
    north: 5,
    east: 2,
    south: 2,
    wStudy: 0.5,
    hStudy: 0.5
  };

  UI.MaxTocLevel = 12;

  UI.SelectOverview = 'SelectOverview';

  UI.SelectPractice = 'SelectPractice';

  UI.SelectStudy = 'SelectStudy';

  UI.intents = [UI.SelectOverview, UI.SelectPractice, UI.SelectStudy];

  return UI;

}).call(this);

//UI.TheStream.publish( 'Content', UI.Build.content( 'Studies', 'createUI', Build.SelectAllPanes ) )
