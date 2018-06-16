import Dom from '../ui/Dom.js';
import Base from '../ui/Base.js';
var Brew,
  boundMethodCheck = function(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new Error('Bound instance method accessed before binding'); } };

Brew = class Brew extends Base {
  constructor(stream, ui) {
    super(ui, stream, 'Brew');
    this.ready = this.ready.bind(this);
    this.onChoice = this.onChoice.bind(this);
    this.stream.subscribe('Choice', 'Brew', (choice) => {
      return this.onChoice(choice);
    });
    this.btns = {};
  }

  ready() {
    boundMethodCheck(this, Brew);
    return Dom.vertBtns(this.stream, this.spec, this, 'img/brew/', 80, 10, 12);
  }

  onChoice(choice) {
    boundMethodCheck(this, Brew);
    Dom.onChoice(choice, 'Brew', this);
  }

};

export default Brew;
