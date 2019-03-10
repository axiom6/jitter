var World,
  hasProp = {}.hasOwnProperty,
  boundMethodCheck = function(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new Error('Bound instance method accessed before binding'); } };

import Util from '../util/Util.js';

import Data from '../util/Data.js';

import UI from '../ui/UI.js';

import Dom from '../ui/Dom.js';

import Base from '../ui/Base.js';

World = class World extends Base {
  constructor(stream, ui) {
    var callback;
    super(stream, ui, 'World');
    this.onClick = this.onClick.bind(this);
    this.onChoice = this.onChoice.bind(this);
    this.$img = $();
    this.wImg = 1785;
    this.hImg = 399;
    this.dw = 50;
    this.dh = 50;
    this.regions = {};
    callback = (data) => {
      var name, ref, region, results;
      this.regions = data;
      this.subscribe();
      ref = this.regions;
      results = [];
      for (name in ref) {
        if (!hasProp.call(ref, name)) continue;
        region = ref[name];
        region.name = name;
        region.chosen = false;
        results.push(region.source = 'World');
      }
      return results;
    };
    //console.log( "Region Data", region )
    Data.asyncJSON("json/jitter/region.json", callback);
    Util.noop(this.$img);
  }

  subscribe() {}

  //@stream.subscribe( 'Choice', (choice) => @onChoice(choice) )
  ready(cname) {
    var $p, src;
    Util.noop(cname);
    src = "../img/region/WorldBelt.png";
    $p = $(`  ${Dom.image(src, 90, 96, "", "24px")}`);
    this.$img = $p.find('img');
    this.$img.click((event) => {
      return this.onClick(event);
    });
    return $p;
  }

  onClick(event) {
    var $elem, offset, region, x, y;
    boundMethodCheck(this, World);
    $elem = $(event.target);
    offset = $elem.offset();
    x = (event.pageX - offset.left) * this.wImg / $elem.width();
    y = (event.pageY - offset.top) * this.hImg / $elem.height();
    region = this.findRegion(x, y);
    region.chosen = !region.chosen;
    region.source = 'World';
    //console.log( 'World.onClick()', { x:x, y:y, w:$elem.width(), h:$elem.height(), l:offset.left, t:offset.top, region:region } )
    this.showRegion(region);
  }

  findRegion(x, y) {
    var abs, df, dr, f, name, r, ref;
    abs = Math.abs;
    f = this.regions['None'];
    ref = this.regions;
    for (name in ref) {
      if (!hasProp.call(ref, name)) continue;
      r = ref[name];
      if (r.x - this.dw <= x && x <= r.x + this.dw && r.y - this.dh <= y && y <= r.y + this.dh) {
        dr = abs(r.x - x) + abs(r.y - y);
        df = abs(f.x - x) + abs(f.y - y);
        if (dr < df) {
          [f.name, f.x, f.y] = [name, r.x, r.y];
        }
      }
    }
    return this.regions[f.name];
  }

  showRegion(region) {
    if (region.name === "None") {
      return;
    }
    this.stream.publish('Region', region);
  }

  onChoice(choice) {
    var region;
    boundMethodCheck(this, World);
    if (choice.name !== 'World' || Util.isntStr(choice.study)) {
      return;
    }
    region = this.regions[choice.study];
    region.chosen = choice.intent === UI.AddChoice;
    region.source = choice.source;
    this.showRegion(region);
  }

};

export default World;
