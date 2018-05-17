import UI   from '../ui/UI.js';
import Dom  from '../ui/Dom.js';
var World,
  hasProp = {}.hasOwnProperty;

World = class World {
  constructor(stream, ui) {
    var callback;
    this.readyView = this.readyView.bind(this);
    this.onClick = this.onClick.bind(this);
    this.onChoice = this.onChoice.bind(this);
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
    UI.readJSON("json/region.json", callback);
  }

  subscribe() {}

  //@stream.subscribe( 'Choice', (choice) => @onChoice(choice) )
  readyPane() {
    var $p, src;
    src = "img/region/WorldBelt.png";
    $p = $(`  ${Dom.image(src, this.pane.toVh(90), this.pane.toVw(96), "", "24px")}`);
    this.$img = $p.find('img');
    this.$img.click((event) => {
      return this.onClick(event);
    });
    return $p;
  }

  readyView() {
    return $("<h1 style=\" display:grid; justify-self:center; align-self:center; \">World</h1>");
  }

  onClick(event) {
    var $elem, offset, region, x, y;
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
    this.spec.num = region.chosen ? this.spec.num + 1 : this.spec.num - 1;
    if (this.spec.num <= this.spec.max) {
      this.stream.publish('Region', region);
    } else {
      this.spec.num = this.spec.num - 1;
      alert(`You can only make ${this.spec.max} choices for World`);
    }
  }

  onChoice(choice) {
    var region;
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
