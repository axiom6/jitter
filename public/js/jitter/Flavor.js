import UI    from '../ui/UI.js';
import Dom   from '../ui/Dom.js';
import Vis   from '../vis/Vis.js';
import Wheel from '../vis/Wheel.js';
var Flavor;

Flavor = class Flavor {
  constructor(stream, ui, name1) {
    this.resize = this.resize.bind(this);
    this.onRegion = this.onRegion.bind(this);
    this.stream = stream;
    this.ui = ui;
    this.name = name1;
    this.ui.addContent(this.name, this);
    this.wheel = new Wheel(this.stream);
    this.prevRegion = null;
    this.srcLg = "img/logo/JitterBoxHead.png";
    this.srcRx = "img/logo/JitterBoxRx.png";
    this.srcRy = "img/logo/JitterBoxRy.png";
  }

  readyPane() {
    var $w, divId, scale, url;
    url = "json/flavor.choice.json";
    scale = 1.3;
    divId = UI.getHtmlId("Wheel", this.pane.name);
    //p = @pane.$
    //p.append( """     #{Dom.image( 0, 0,100, 10,@srcLg,15,"","24px") }""" )
    //p.append( """     #{Dom.image(-4, 0, 15, 10,@srcRy,30,"","24px") }""" )
    //p.append( """     #{Dom.image(75, 0, 15, 10,@srcRx,30,"","24px") }""" )
    $w = $(`<div ${Dom.panel(0, 5, 100, 95)} id="${divId}"></div>`);
    //w.css( { "background-image":"url(img/flavor/jitterPourOverBg.png)" } )
    //w.css( { "background-color":"#8d6566" } )
    this.wheel.ready(this.pane, this.spec, $w.get(0), url, scale);
    window.addEventListener("resize", this.resize);
    this.subscribe(this.name);
    return $w;
  }

  resize() {
    this.pane.geo = this.pane.geom();
    return this.wheel.resize();
  }

  subscribe(name) {
    if (name === 'Flavors') {
      this.stream.subscribe('Region', (select) => {
        return this.onRegion(select);
      });
    }
  }

  onRegion(select) {
    var d, flavor, i, j, len, len1, ref, ref1, region;
    region = select.study;
    if (region != null) {
      console.log('Flavors.onRegion()', {
        name: region.name,
        flavors: region.flavors
      });
    }
    if (true) {
      return;
    }
    if ((this.prevRegion != null) && (this.prevRegion.flavors != null)) {
      ref = this.prevRegion.flavors;
      for (i = 0, len = ref.length; i < len; i++) {
        flavor = ref[i];
        d = this.wheel.lookup[flavor];
        if (d != null) {
          this.wheel.magnify(d, 'click');
        }
      }
    }
    if ((region != null) && (region.flavors != null)) {
      ref1 = region.flavors;
      for (j = 0, len1 = ref1.length; j < len1; j++) {
        flavor = ref1[j];
        d = this.wheel.lookup[flavor];
        if (d != null) {
          this.wheel.magnify(d, 'click');
        }
      }
      this.prevRegion = region;
    }
  }

  readyView() {
    var src;
    src = "img/flavor/Flavor.png";
    this.$view.append(`<div ${Dom.panel(0, 0, 100, 100)}></div>`);
    this.$view.append(`<h1  ${Dom.label(0, 0, 100, 10)}>Flavor</h1>`);
    this.$view.append(`     ${Dom.image(0, 10, 100, 90, src, 150)}`);
    return this.$view;
  }

};

export default Flavor;
