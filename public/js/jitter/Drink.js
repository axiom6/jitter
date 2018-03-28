(function() {
  var Drink;

  Drink = (function() {
    class Drink {
      constructor(stream) {
        this.stream = stream;
      }

      overview(pane, spec) {
        var $e, src;
        src = "img/drink/DrinkReady.jpg";
        $e = $(`<div ${Jitter.rel(0, 0, 100, 100)}></div>`);
        $e.append(`<h1 ${Jitter.abs(0, 0, 100, 10)}>${spec.name}</h1>`);
        $e.append(`  ${Jitter.abi(0, 10, 100, 90, src, 150)}`);
        pane.$.append($e);
      }

      ready(pane, spec) {
        Jitter.vert(pane, spec, 'img/drink/', 0.75, 0, 10);
      }

      create(pane, spec) {
        var $e, array, i, j, k, len, len1, ref, ref1, where, x, y;
        $e = $(`<div    ${Jitter.rel(0, 0, 100, 100)}></div>`);
        $e.append(`<div ${Jitter.abs(0, 0, 100, 10)}>${spec.name}</div>`);
        where = function(key) {
          return UI.isChild(key);
        };
        array = Util.toArray(spec, where, 'id');
        i = 0;
        ref = [10, 55];
        for (j = 0, len = ref.length; j < len; j++) {
          y = ref[j];
          ref1 = [0, 33, 66];
          for (k = 0, len1 = ref1.length; k < len1; k++) {
            x = ref1[k];
            $e.append(`<div ${Jitter.abs(x, y, 33, 45)}><h3>${array[i].name}</h3></div>`);
            i = i + 1;
          }
        }
        pane.$.append($e);
      }

    };

    Jitter.Drink = Drink;

    return Drink;

  }).call(this);

}).call(this);
