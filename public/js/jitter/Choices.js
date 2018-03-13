(function() {
  var Choices;

  Choices = (function() {
    class Choices {
      constructor(stream) {
        this.stream = stream;
      }

      overview(pane, spec) {
        Util.noop(pane, spec);
      }

      ready(pane, spec) {}

      create(pane, spec) {
        Util.noop(pane, spec);
      }

    };

    Jitter.Choices = Choices;

    return Choices;

  }).call(this);

}).call(this);
