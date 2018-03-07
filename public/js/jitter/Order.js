(function() {
  var Order;

  Order = (function() {
    class Order {
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

    Jitter.Order = Order;

    return Order;

  }).call(this);

}).call(this);
