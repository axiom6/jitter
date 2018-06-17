import Dom  from '../ui/Dom.js';
import Base from '../ui/Base.js';
var Drink,
  boundMethodCheck = function(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new Error('Bound instance method accessed before binding'); } };

Drink = class Drink extends Base {
  constructor(stream, ui) {
    super(stream, ui, 'Drink');
    this.ready = this.ready.bind(this);
    this.onChoice = this.onChoice.bind(this);
    this.stream.subscribe('Choice', 'Drink', (choice) => {
      return this.onChoice(choice);
    });
    this.btns = {};
  }

  ready() {
    boundMethodCheck(this, Drink);
    return Dom.vertBtns(this.stream, this.spec, this, 'img/drink/', 80, 10, 12);
  }

  onChoice(choice) {
    boundMethodCheck(this, Drink);
    Dom.onChoice(choice, 'Drink', this);
  }

};

export default Drink;
