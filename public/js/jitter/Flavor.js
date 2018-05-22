import Util  from '../util/Util.js';
import UI    from '../ui/UI.js';
import Dom   from '../ui/Dom.js';
import Vis   from '../vis/Vis.js';
import Wheel from '../jitter/Wheel.js';
var Flavor;

Flavor = class Flavor {
  constructor(stream, ui, name1) {
    // Passed as a callback to Wheel and called when Wheel makes a choice to be published
    this.publish = this.publish.bind(this);
    this.resize = this.resize.bind(this);
    this.onRegion = this.onRegion.bind(this);
    this.onChoice = this.onChoice.bind(this);
    this.readyView = this.readyView.bind(this);
    this.stream = stream;
    this.ui = ui;
    this.name = name1;
    this.ui.addContent(this.name, this);
    this.wheel = new Wheel(this.publish, Dom.opacity);
    this.prevRegion = null;
  }

  publish(add, flavor) {
    var addDel, choice;
    addDel = add ? UI.AddChoice : UI.DelChoice;
    this.spec.num = add ? this.spec.num + 1 : this.spec.num - 1;
    if (this.spec.num <= this.spec.max) {
      choice = UI.select(this.spec.name, 'Wheel', addDel, flavor);
      this.stream.publish('Choice', choice);
    } else {
      this.spec.num = this.spec.num - 1;
      alert(`You can only make ${this.spec.max} choices for Flavor`);
      this.onWheel('DelChoice', flavor);
    }
  }

  subscribe(name) {
    if (name === 'Flavors') {
      this.stream.subscribe('Region', name, (region) => {
        return this.onRegion(region);
      });
    }
    if (name === 'Flavor') {
      this.stream.subscribe('Choice', name, (choice) => {
        return this.onChoice(choice);
      });
    }
  }

  readyPane() {
    var $w, divId, scale, url;
    url = "json/flavor.choice.json";
    scale = 1.3;
    divId = this.ui.getHtmlId("Wheel", this.pane.name);
    $w = $(`<div ${Dom.panel(0, 5, 100, 95)} id="${divId}"></div>`);
    this.wheel.ready(this.pane, this.spec, $w.get(0), url, scale);
    window.addEventListener("resize", this.resize);
    this.subscribe(this.name);
    return $w;
  }

  resize() {
    this.pane.geo = this.pane.geom();
    this.wheel.resize();
  }

  onRegion(region) {
    var flavor, i, j, len, len1, ref, ref1;
    if ((region != null) && this.stream.isInfo('Region')) {
      console.info('Flavor.onRegion()', {
        instance: this.name,
        name: region.name,
        flavors: region.flavors
      });
    }
    if (this.name === 'Flavor') { // Only the Flavors name instance responds to onRegion()
      return;
    }
    if ((this.prevRegion != null) && (this.prevRegion.flavors != null)) {
      ref = this.prevRegion.flavors;
      for (i = 0, len = ref.length; i < len; i++) {
        flavor = ref[i];
        this.onWheel('DelChoice', flavor);
      }
    }
    if ((region != null) && (region.flavors != null)) {
      ref1 = region.flavors;
      for (j = 0, len1 = ref1.length; j < len1; j++) {
        flavor = ref1[j];
        this.onWheel('AddChoice', flavor);
      }
      this.prevRegion = region;
    }
  }

  onWheel(addDel, flavor) {
    var d;
    d = this.wheel.lookup[flavor];
    if (d != null) {
      this.wheel.onEvent(d, addDel);
    }
  }

  onChoice(choice) {
    var addDel;
    if (choice.source === 'Flavor' || Util.isntStr(choice.study)) {
      return;
    }
    addDel = choice.intent === UI.AddChoice ? 'AddChoice' : 'DelChoice';
    this.onWheel(addDel, choice.study);
  }

  readyView() {
    return $("<h1 style=\" display:grid; justify-self:center; align-self:center; \">Flavor</h1>");
  }

};

export default Flavor;
