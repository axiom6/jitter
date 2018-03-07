(function() {
  var Roast;

  Roast = (function() {
    class Roast {
      constructor(stream) {
        this.stream = stream;
      }

      overview(pane, spec) {
        var $e, src;
        src = "img/roast/Coffee-Bean-Roast-Ready.jpg";
        $e = $(`<div ${Jitter.rel(0, 0, 100, 100)}></div>`);
        $e.append(`<h1 ${Jitter.abs(0, 0, 100, 10)}>${spec.name}</h1>`);
        $e.append(`  ${Jitter.abi(0, 10, 100, 90, src, 150)}`);
        pane.$.append($e);
      }

      ready(pane, spec) {
        var $e, array, i, j, len, ref, src, where, x, y;
        $e = $(`<div   ${Jitter.rel(0, 0, 100, 100)}></div>`);
        $e.append(`<h2 ${Jitter.abs(0, 0, 100, 10)}>${spec.name}</h2>`);
        where = function(key) {
          return UI.isChild(key);
        };
        array = Util.toArray(spec, where, 'id');
        i = 0;
        x = 0;
        ref = [10, 23, 36, 49, 62, 75, 88];
        for (j = 0, len = ref.length; j < len; j++) {
          y = ref[j];
          src = "img/roast/" + array[i].icon;
          $e.append(`${Jitter.abi(x, y, 100, 13, src, 100)}`);
          i = i + 1;
        }
        return pane.$.append($e);
      }

      create(pane, spec) {
        var $e, src;
        pane.$.append(`<h1>${spec.name}</h1>`);
        $e = $(`<div ${Jitter.rel(0, 0, 100, 100)}></div>`);
        src = "img/roast/FiveRoasts.jpeg";
        $e.append(`<img ${Jitter.img(src)}/>`);
        //$e.append( """<div><span>Light</span><span>Medium Light</span><span>Medium</span><span>Medium Dark</span><span>Dark</span></div>""")
        pane.$.append($e);
      }

    };

    Jitter.Roast = Roast;

    return Roast;

  }).call(this);

}).call(this);
