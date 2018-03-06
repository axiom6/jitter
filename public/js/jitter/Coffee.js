(function() {
  var Coffee;

  Coffee = (function() {
    class Coffee {
      constructor(stream) {
        this.stream = stream;
      }

      ready(pane, spec) {
        pane.$.append(`<h1>${spec.name}</h1>`);
      }

      create(pane, spec) {
        pane.$.append(`<h1>${spec.name}</h1>`);
      }

    };

    Jitter.Coffee = Coffee;

    return Coffee;

  }).call(this);

}).call(this);
