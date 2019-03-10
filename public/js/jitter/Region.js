var Region,
  boundMethodCheck = function(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new Error('Bound instance method accessed before binding'); } };

import Util from '../util/Util.js';

import UI from '../ui/UI.js';

import Dom from '../ui/Dom.js';

import Base from '../ui/Base.js';

Region = class Region extends Base {
  constructor(stream, ui) { // , @world
    super(stream, ui, 'Region');
    this.onRegion = this.onRegion.bind(this);
  }

  // @$img = $()
  subscribe() {
    this.stream.subscribe('Region', 'Region', (region) => {
      return this.onRegion(region);
    });
  }

  ready(cname) {
    var $p, src;
    Util.noop(cname);
    src = "../img/region/Ethiopia.png";
    $p = $(`  ${Dom.image(src, 90, 96, "Ethopia", "24px")}`);
    this.$image = $p.find('.dom-image');
    this.$label = $p.find('.dom-label');
    this.$label.css("font-size", `${this.pane.toVh(10)}vh`);
    this.$label.hide();
    this.subscribe();
    return $p;
  }

  onRegion(region) {
    var addDel, choice, label, src;
    boundMethodCheck(this, Region);
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
      src = `../img/region/${region.name}.png`;
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
