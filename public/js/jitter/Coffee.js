(function() {
  var Coffee;

  Coffee = (function() {
    class Coffee {
      constructor(stream) {
        this.stream = stream;
      }

      overview(pane, spec) {
        pane.$.append(`<h1>${spec.name}</h1>`);
      }

      ready(pane, spec) {
        this.create(pane, spec);
      }

      create(pane, spec) {
        pane.$.append(`<h1>${spec.name}</h1>`);
      }

    };

    Jitter.Coffee = Coffee;

    return Coffee;

  }).call(this);

}).call(this);
