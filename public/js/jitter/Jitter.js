var Jitter;

Jitter = class Jitter {
  static init() {
    Util.ready(function() {
      var jitter, stream, subjects, ui;
      subjects = ['Select', 'Choice'];
      stream = new Util.Stream(subjects);
      ui = new UI(stream);
      jitter = new Jitter(stream, ui);
      Util.noop(jitter);
    });
  }

  constructor(stream1, ui1) {
    this.stream = stream1;
    this.ui = ui1;
    this.flavor = new Jitter.Flavor(this.stream, this.ui);
    this.choices = new Jitter.Choices(this.stream, this.ui);
    this.roast = new Jitter.Roast(this.stream, this.ui);
    this.drink = new Jitter.Drink(this.stream, this.ui);
    this.body = new Jitter.Body(this.stream, this.ui);
    this.brew = new Jitter.Brew(this.stream, this.ui);
  }

};
