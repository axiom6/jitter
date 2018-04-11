var Jitter;

import Util from '../util/Util.js';

import Stream from '../util/Stream.js';

import UI from '../ui/UI.js';

import Head from '../jitter/Head.js';

import Flavor from '../jitter/Flavor.js';

import Interact from '../jitter/Interact.js';

import Summary from '../jitter/Summary.js';

import Roast from '../jitter/Roast.js';

import Drink from '../jitter/Drink.js';

import Body from '../jitter/Body.js';

import Brew from '../jitter/Brew.js';

import World from '../jitter/World.js';

import Region from '../jitter/Region.js';

export default Jitter = (function() {
  class Jitter {
    static init() {
      Util.ready(function() {
        var jitter, stream, subjects, ui;
        subjects = ['Select', 'Choice', "Region", "Flavors"];
        stream = new Stream(subjects);
        ui = new UI(stream, "json/toc.json");
        jitter = new Jitter(stream, ui);
        Util.noop(jitter);
      });
    }

    constructor(stream1, ui1) {
      this.stream = stream1;
      this.ui = ui1;
      //head1    = new Head(     @stream, @ui, "Head1" )
      //head2    = new Head(     @stream, @ui, "Head2" )
      this.world = new World(this.stream, this.ui);
      this.region = new Region(this.stream, this.ui);
      this.interact = new Interact(this.stream, this.ui, "Interact", Jitter.SpecInteract);
      this.flavor = new Flavor(this.stream, this.ui, "Flavor");
      this.flavors = new Flavor(this.stream, this.ui, "Flavors");
      this.summary = new Summary(this.stream, this.ui);
      this.roast = new Roast(this.stream, this.ui);
      this.drink = new Drink(this.stream, this.ui);
      this.body = new Body(this.stream, this.ui);
      this.brew = new Brew(this.stream, this.ui);
    }

  };

  Jitter.SpecInteract = {
    Maps: {
      type: "group"
    },
    World: {
      type: "pane"
    },
    Region: {
      type: "pane"
    },
    Flavors: {
      type: "pane"
    },
    Taste: {
      type: "group"
    },
    Flavor: {
      type: "pane"
    },
    Roast: {
      type: "pane"
    },
    Prepare: {
      type: "group"
    },
    Brew: {
      type: "pane"
    },
    Drink: {
      type: "pane"
    },
    Body: {
      type: "pane"
    },
    Summary: {
      type: "pane"
    }
  };

  return Jitter;

}).call(this);

//console.log( 'window', window )
Jitter.init();
