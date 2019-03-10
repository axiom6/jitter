var Body,
  boundMethodCheck = function(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new Error('Bound instance method accessed before binding'); } };

import Util from '../util/Util.js';

import Dom from '../ui/Dom.js';

import Base from '../ui/Base.js';

Body = class Body extends Base {
  constructor(stream, ui) {
    super(stream, ui, 'Body');
    this.ready = this.ready.bind(this);
    this.onChoice = this.onChoice.bind(this);
    this.stream.subscribe('Choice', 'Body', (choice) => {
      return this.onChoice(choice);
    });
    this.btns = {};
  }

  ready(cname) {
    boundMethodCheck(this, Body);
    Util.noop(cname);
    return Dom.vertBtns(this.stream, this.spec, this, '../img/body/', 70, 15, 12);
  }

  onChoice(choice) {
    boundMethodCheck(this, Body);
    Dom.onChoice(choice, 'Body', this);
  }

};

export default Body;
