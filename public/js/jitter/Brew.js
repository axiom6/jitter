var Brew,
  boundMethodCheck = function(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new Error('Bound instance method accessed before binding'); } };

import Util from '../util/Util.js';

import Dom from '../ui/Dom.js';

import Base from '../ui/Base.js';

Brew = class Brew extends Base {
  constructor(stream, ui) {
    super(stream, ui, 'Brew');
    this.ready = this.ready.bind(this);
    this.onChoice = this.onChoice.bind(this);
    this.stream.subscribe('Choice', 'Brew', (choice) => {
      return this.onChoice(choice);
    });
    this.btns = {};
  }

  ready(cname) {
    boundMethodCheck(this, Brew);
    Util.noop(cname);
    return Dom.vertBtns(this.stream, this.spec, this, '../img/brew/', 80, 10, 12);
  }

  onChoice(choice) {
    boundMethodCheck(this, Brew);
    Dom.onChoice(choice, 'Brew', this);
  }

};

export default Brew;
