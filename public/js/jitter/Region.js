var Region;

import Util from '../util/Util.js';

import Dom from '../ui/Dom.js';

export default Region = class Region {
  constructor(stream, ui) {
    this.onRegion = this.onRegion.bind(this);
    this.stream = stream;
    this.ui = ui;
    this.ui.addContent('Region', this);
    this.$img = $();
  }

  subscribe() {
    this.stream.subscribe('Region', (select) => {
      return this.onRegion(select);
    });
  }

  readyPane() {
    var $p, src;
    src = "img/region/Ethiopia.png";
    $p = $(`  ${Dom.image(0, 0, 100, 100, src, 100, "Ethopia", "24px", 66)}`);
    this.$image = $p.find('img');
    this.$label = $p.find('.label');
    this.$label.hide();
    this.subscribe();
    return $p;
  }

  readyView() {
    return this.readyPane();
  }

  onRegion(select) {
    var label, region, src;
    region = select.study;
    if (region.img) {
      src = `img/region/${region.name}.png`;
      this.$label.hide();
      this.$image.attr('src', src).show();
    } else {
      label = Util.toName(region.name); // Puts spaces between Camel Case text
      this.$image.hide();
      this.$label.text(label).show();
    }
  }

};
