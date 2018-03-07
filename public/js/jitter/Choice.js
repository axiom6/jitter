(function() {
  var Choice;

  Choice = (function() {
    class Choice {
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

    Jitter.Choice = Choice;

    return Choice;

  }).call(this);

}).call(this);
