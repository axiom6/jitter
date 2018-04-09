var Flavor;

import UI from '../ui/UI.js';

import Dom from '../ui/Dom.js';

import Vis from '../vis/Vis.js';

import Wheel from '../vis/Wheel.js';

export default Flavor = class Flavor {
  constructor(stream, ui, name1) {
    this.resize = this.resize.bind(this);
    this.onFlavors = this.onFlavors.bind(this);
    this.stream = stream;
    this.ui = ui;
    this.name = name1;
    this.ui.addContent(this.name, this);
    this.wheel = new Wheel(this.stream);
    this.srcLg = "img/logo/JitterBoxHead.png";
    this.srcRx = "img/logo/JitterBoxRx.png";
    this.srcRy = "img/logo/JitterBoxRy.png";
  }

  readyPane() {
    var $p, $w, divId, scale, url;
    url = "json/flavor.choice.json";
    scale = 1.3;
    divId = UI.getHtmlId("Wheel", this.pane.name);
    $p = this.pane.$;
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
      this.stream.subscribe('Flavors', (flavor) => {
        return this.onFlavors(flavor);
      });
    }
  }

  onFlavors(flavor) {
    var d;
    console.log('Flavor', flavor);
    d = this.wheel.lookup[flavor];
    if (d != null) {
      this.wheel.magnify(d, 'click');
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
