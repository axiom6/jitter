"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function () {
  var Page;

  Page = function () {
    var Page = function () {
      function Page(stream) {
        _classCallCheck(this, Page);

        this.stream = stream;
        this.view = null; // Set by ready()
        this.flavor = new Jitter.Flavor(this.stream);
        this.roast = new Jitter.Roast(this.stream);
        this.drink = new Jitter.Drink(this.stream);
        this.body = new Jitter.Body(this.stream);
        this.brew = new Jitter.Brew(this.stream);
        this.aroma = new Jitter.Aroma(this.stream);
        this.choice = new Jitter.Choice(this.stream);
        this.coffee = new Jitter.Coffee(this.stream);
        this.order = new Jitter.Order(this.stream);
      }

      _createClass(Page, [{
        key: "ready",
        value: function ready(view, spec) {
          var i, len, pane, ref;
          this.view = view;
          this.spec = spec;
          ref = this.view.panes;
          for (i = 0, len = ref.length; i < len; i++) {
            pane = ref[i];
            this.readyContent(pane, spec[pane.name]);
          }
        }
      }, {
        key: "readyContent",
        value: function readyContent(pane, spec) {
          pane.page = this;
          pane.$.empty();
          switch (pane.name) {
            case "Flavor":
              this.flavor.ready(pane, spec);
              break;
            case "Roast":
              this.roast.ready(pane, spec);
              break;
            case "Drink":
              this.drink.ready(pane, spec);
              break;
            case "Body":
              this.body.ready(pane, spec);
              break;
            case "Brew":
              this.brew.ready(pane, spec);
              break;
            case "Aroma":
              this.aroma.ready(pane, spec);
              break;
            case "Choice":
              this.choice.ready(pane, spec);
              break;
            case "Coffee":
              this.coffee.ready(pane, spec);
              break;
            case "Order":
              this.order.ready(pane, spec);
              break;
            default:
              Util.error("Page.readyContent() unknown pane.name", pane.name);
          }
        }
      }, {
        key: "onSelect",
        value: function onSelect(pane, select) {
          UI.verifySelect(select, 'Page');
          switch (select.intent) {
            case UI.SelectOverview:
              this.selectOverview();
              break;
            case UI.SelectPractice:
              this.selectPractice(pane);
              break;
            case UI.SelectStudy:
              this.selectStudy(pane);
              break;
            default:
              Util.error("Page.selectContent() unknown select", select);
          }
        }
      }, {
        key: "selectOverview",
        value: function selectOverview() {
          var i, len, pane, ref, results;
          ref = this.view.panes;
          results = [];
          for (i = 0, len = ref.length; i < len; i++) {
            pane = ref[i];
            results.push(this.readyContent(pane, this.spec[pane.name]));
          }
          return results;
        }
      }, {
        key: "selectPractice",
        value: function selectPractice(pane) {
          return this.createContent(pane, this.spec[pane.name]);
        }
      }, {
        key: "selectStudy",
        value: function selectStudy(pane) {
          Util.noop(pane);
        }
      }, {
        key: "createContent",
        value: function createContent(pane, spec) {
          pane.$.empty();
          switch (pane.name) {
            case "Flavor":
              this.flavor.create(pane, spec);
              break;
            case "Roast":
              this.roast.create(pane, spec);
              break;
            case "Drink":
              this.drink.create(pane, spec);
              break;
            case "Body":
              this.body.create(pane, spec);
              break;
            case "Brew":
              this.brew.create(pane, spec);
              break;
            case "Aroma":
              this.aroma.create(pane, spec);
              break;
            case "Choice":
              this.choice.create(pane, spec);
              break;
            case "Coffee":
              this.coffee.create(pane, spec);
              break;
            case "Order":
              this.order.create(pane, spec);
              break;
            default:
              Util.error("Page.createContent() unknown pane.name", pane.name);
          }
        }
      }]);

      return Page;
    }();

    ;

    Jitter.Page = Page;

    return Page;
  }.call(this);
}).call(undefined);
