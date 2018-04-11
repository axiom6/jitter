import UI   from '../ui/UI.js';
import Dom  from '../ui/Dom.js';
var World,
  hasProp = {}.hasOwnProperty;

World = class World {
  constructor(stream, ui) {
    var callback;
    this.onClick = this.onClick.bind(this);
    this.stream = stream;
    this.ui = ui;
    this.ui.addContent('World', this);
    this.$img = $();
    this.wImg = 1785;
    this.hImg = 399;
    this.dw = 50;
    this.dh = 50;
    this.regions = {};
    callback = (data) => {
      var name, ref, region, results;
      this.regions = data;
      ref = this.regions;
      results = [];
      for (name in ref) {
        if (!hasProp.call(ref, name)) continue;
        region = ref[name];
        results.push(region.name = name);
      }
      return results;
    };
    //console.log( "Region Data", region )
    UI.readJSON("json/region.json", callback);
  }

  readyPane() {
    var $p, mh, mw, src;
    src = "img/region/WorldBelt.png";
    mh = this.pane.toVh(96);
    mw = this.pane.toVw(96);
    $p = $(`  ${Dom.image(0, 0, 100, 100, src, mh, "", "24px", mw)}`);
    this.$img = $p.find('img');
    this.$img.click((event) => {
      return this.onClick(event);
    });
    return $p;
  }

  readyView() {
    return this.readyPane();
  }

  onClick(event) {
    var $elem, offset, region, x, y;
    $elem = $(event.target);
    offset = $elem.offset();
    x = (event.pageX - offset.left) * this.wImg / $elem.width();
    y = (event.pageY - offset.top) * this.hImg / $elem.height();
    region = this.findRegion(x, y);
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
    var select;
    if (region.name === "None") {
      return;
    }
    select = UI.select('Region', 'World', UI.SelectStudy, region);
    this.stream.publish('Region', select);
    console.log('World.showRegion()', {
      region: region
    });
  }

};

export default World;
