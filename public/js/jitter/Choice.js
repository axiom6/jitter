(function() {
  var Choice;

  Choice = (function() {
    class Choice {
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

    Jitter.Choice = Choice;

    return Choice;

  }).call(this);

}).call(this);
