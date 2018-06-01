import Util from '../util/Util.js';
import UI   from '../ui/UI.js';
import Dom  from '../ui/Dom.js';
var Region;

Region = class Region {
  constructor(stream, ui, world) {
    this.readyView = this.readyView.bind(this);
    this.onRegion = this.onRegion.bind(this);
    this.stream = stream;
    this.ui = ui;
    this.world = world;
    this.ui.addContent('Region', this);
    this.$img = $();
  }

  subscribe() {
    this.stream.subscribe('Region', 'Region', (region) => {
      return this.onRegion(region);
    });
  }

  readyPane() {
    var $p, src;
    src = "img/region/Ethiopia.png";
    $p = $(`  ${Dom.image(src, this.pane.toVh(90), this.pane.toVw(96), "Ethopia", "24px")}`);
    this.$image = $p.find('.dom-image');
    this.$label = $p.find('.dom-label');
    this.$label.css("font-size", `${this.pane.toVh(10)}vh`);
    this.$label.hide();
    this.subscribe();
    return $p;
  }

  readyView() {
    return $("<h1 style=\" display:grid; justify-self:center; align-self:center; \">Region</h1>");
  }

  onRegion(region) {
    var addDel, choice, label, src;
    if ((region == null) || region.source === 'Region') {
      return;
    }
    if (this.stream.isInfo('Region')) {
      console.info('Region.onRegion()', {
        name: region.name,
        chosen: region.chosen,
        flavors: region.flavors
      });
    }
    if ((region.img != null) && region.img) {
      src = `img/region/${region.name}.png`;
      this.$label.hide();
      this.$image.attr('src', src).show();
    } else {
      label = Util.toName(region.name); // Puts spaces between Camel Case text
      this.$image.hide();
      this.$label.text(label).show();
    }
    // Publish Region to update Flavors
    if (Util.isArray(region.flavors)) { // This really to update Flavors
      region.source = 'Region';
      this.stream.publish('Region', region);
    }
    // Publish Choice to update Summaries
    addDel = region.chosen ? UI.AddChoice : UI.DelChoice;
    choice = UI.toTopic('Region', 'Region', addDel, region.name);
    this.stream.publish('Choice', choice);
  }

};

export default Region;
