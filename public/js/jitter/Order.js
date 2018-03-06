(function() {
  var Order;

  Order = (function() {
    class Order {
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

    Jitter.Order = Order;

    return Order;

  }).call(this);

}).call(this);
