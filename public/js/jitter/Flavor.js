var Flavor,
  boundMethodCheck = function(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new Error('Bound instance method accessed before binding'); } };

import Util from '../util/Util.js';

import Data from '../util/Data.js';

import UI from '../ui/UI.js';

import Dom from '../ui/Dom.js';

import Base from '../ui/Base.js';

import Wheel from '../jitter/Wheel.js';

Flavor = class Flavor extends Base {
  constructor(stream, ui, name) {
    super(stream, ui, name);
    // Passed as a callback to Wheel and called when Wheel makes a choice to be published
    this.publish = this.publish.bind(this);
    this.resize = this.resize.bind(this);
    this.onRegion = this.onRegion.bind(this);
    this.onChoice = this.onChoice.bind(this);
    this.wheel = new Wheel(this.publish, Dom.opacity);
    this.prevRegion = null;
    if (false) {
      console.log(this.prevRegion);
    }
  }

  publish(add, flavor, roast) {
    var addDel, choice;
    boundMethodCheck(this, Flavor);
    addDel = add ? UI.AddChoice : UI.DelChoice;
    choice = UI.toTopic(this.spec.name, 'Wheel', addDel, flavor);
    choice.value = roast;
    this.stream.publish('Choice', choice);
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

  ready(cname) {
    var $w, divId, scale, url;
    Util.noop(cname);
    url = Data.local + "json/jitter/flavor.choice.json";
    scale = 1.1;
    divId = this.ui.getHtmlId("Wheel", this.pane.name);
    $w = $(`<div ${Dom.panel(0, 5, 100, 95)} id="${divId}"></div>`);
    this.wheel.ready(this.pane, this.spec, $w.get(0), url, scale);
    window.addEventListener("resize", this.resize);
    this.subscribe(this.name);
    return $w;
  }

  resize() {
    boundMethodCheck(this, Flavor);
    this.pane.geo = this.pane.geom();
    this.wheel.resize();
  }

  onRegion(region) {
    var flavor, i, j, len, len1, ref, ref1;
    boundMethodCheck(this, Flavor);
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
    var addDel, flavor;
    boundMethodCheck(this, Flavor);
    if (!(choice.name === 'Flavor') || choice.source === 'Flavor') {
      return;
    }
    //eturn if not ( choice.name is 'Flavor' or choice.name is 'Roast' ) or choice.source is 'Flavor'
    flavor = "";
    if (choice.name === 'Flavor' && Util.isStr(choice.study)) {
      flavor = choice.study;
    } else if (choice.name === 'Roast' && (choice.value != null)) {
      flavor = this.wheel.getFlavorName(choice.value);
    }
    addDel = choice.intent === UI.AddChoice ? 'AddChoice' : 'DelChoice';
    if (Util.isStr(flavor)) {
      this.onWheel(addDel, flavor);
    }
  }

};

export default Flavor;
