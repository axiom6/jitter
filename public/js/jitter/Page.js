(function() {
  var Page;

  Page = (function() {
    class Page {
      constructor(stream) {
        this.stream = stream;
        Jitter.page = this;
        this.view = null; // Set by ready()
        this.flavor = new Jitter.Flavor(this.stream);
        //logo    = new Jitter.Logo(    @stream )
        this.choices = new Jitter.Choices(this.stream);
        this.roast = new Jitter.Roast(this.stream);
        this.drink = new Jitter.Drink(this.stream);
        this.body = new Jitter.Body(this.stream);
        this.brew = new Jitter.Brew(this.stream);
        //aroma   = new Jitter.Aroma(   @stream )
        this.coffee = new Jitter.Coffee(this.stream);
        this.order = new Jitter.Order(this.stream);
      }

      ready(view, spec) {
        var i, len, pane, ref;
        this.view = view;
        this.spec = spec;
        ref = this.view.panes;
        for (i = 0, len = ref.length; i < len; i++) {
          pane = ref[i];
          this.readyContent(pane, spec[pane.name]);
        }
      }

      overview(view, spec) {
        var i, len, pane, ref;
        this.view = view;
        this.spec = spec;
        ref = this.view.panes;
        for (i = 0, len = ref.length; i < len; i++) {
          pane = ref[i];
          this.overviewContent(pane, spec[pane.name]);
        }
      }

      onSelect(pane, select) {
        UI.verifySelect(select, 'Page');
        switch (select.intent) {
          case UI.SelectReady:
            this.selectReady();
            break;
          case UI.SelectOverview:
            this.selectOverview();
            break;
          case UI.SelectPractice:
            this.selectPractice(pane);
            break;
          case UI.SelectStudy:
            this.selectStudy(pane, select.study);
            break;
          default:
            Util.error("Page.selectContent() unknown select", select);
        }
      }

      selectReady() {
        var i, len, pane, ref, results;
        ref = this.view.panes;
        results = [];
        for (i = 0, len = ref.length; i < len; i++) {
          pane = ref[i];
          results.push(this.readyContent(pane, this.spec[pane.name]));
        }
        return results;
      }

      selectOverview() {
        var i, len, pane, ref, results;
        ref = this.view.panes;
        results = [];
        for (i = 0, len = ref.length; i < len; i++) {
          pane = ref[i];
          results.push(this.overviewContent(pane, this.spec[pane.name]));
        }
        return results;
      }

      selectPractice(pane) {
        return this.createContent(pane, this.spec[pane.name]);
      }

      selectStudy(pane, study) {
        this.createContent(pane, this.spec[pane.name], study);
      }

      overviewContent(pane, spec) {
        pane.page = this;
        pane.$.empty();
        switch (pane.name) {
          //hen "Logo"    then    @logo.overview( pane, spec )
          case "Flavor":
            this.flavor.overview(pane, spec);
            break;
          case "Choices":
            this.choices.overview(pane, spec);
            break;
          case "Roast":
            this.roast.overview(pane, spec);
            break;
          case "Drink":
            this.drink.overview(pane, spec);
            break;
          case "Body":
            this.body.overview(pane, spec);
            break;
          case "Brew":
            this.brew.overview(pane, spec);
            break;
          //hen "Aroma"   then   @aroma.overview( pane, spec )
          case "Coffee":
            this.coffee.overview(pane, spec);
            break;
          case "Order":
            this.order.overview(pane, spec);
            break;
          default:
            Util.error("Page.overviewContent() unknown pane.name", pane.name);
        }
      }

      readyContent(pane, spec) {
        pane.page = this;
        pane.$.empty();
        switch (pane.name) {
          //hen "Logo"    then    @logo.ready( pane, spec )
          case "Flavor":
            this.flavor.ready(pane, spec);
            break;
          case "Choices":
            this.choices.ready(pane, spec);
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
          //hen "Aroma"   then   @aroma.ready( pane, spec )
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

      createContent(pane, spec, study = null) {
        pane.$.empty();
        switch (pane.name) {
          //hen "Logo"    then    @logo.create( pane, spec )
          case "Flavor":
            this.flavor.create(pane, spec, study);
            break;
          case "Choices":
            this.choices.create(pane, spec);
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
          //hen "Aroma"   then   @aroma.create( pane, spec )
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

    };

    Jitter.Page = Page;

    return Page;

  }).call(this);

}).call(this);
