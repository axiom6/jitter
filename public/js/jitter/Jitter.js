var Jitter;

import Util from '../util/Util.js';

import Stream from '../util/Stream.js';

import UI from '../ui/UI.js';

import Head from '../jitter/Head.js';

import Flavor from '../jitter/Flavor.js';

import Choices from '../jitter/Choices.js';

import Roast from '../jitter/Roast.js';

import Drink from '../jitter/Drink.js';

import Body from '../jitter/Body.js';

import Brew from '../jitter/Brew.js';

import Map from '../jitter/Map.js';

export default Jitter = class Jitter {
  static init() {
    Util.ready(function() {
      var jitter, stream, subjects, ui;
      subjects = ['Select', 'Choice'];
      stream = new Stream(subjects);
      ui = new UI(stream, "json/toc.json");
      jitter = new Jitter(stream, ui);
      Util.noop(jitter);
    });
  }

  constructor(stream1, ui1) {
    this.stream = stream1;
    this.ui = ui1;
    this.head1 = new Head(this.stream, this.ui, "Head1");
    this.head2 = new Head(this.stream, this.ui, "Head2");
    this.flavor = new Flavor(this.stream, this.ui);
    this.choices = new Choices(this.stream, this.ui);
    this.roast = new Roast(this.stream, this.ui);
    this.drink = new Drink(this.stream, this.ui);
    this.body = new Body(this.stream, this.ui);
    this.brew = new Brew(this.stream, this.ui);
    this.map = new Map(this.stream, this.ui);
  }

};

//console.log( 'window', window )
Jitter.init();
