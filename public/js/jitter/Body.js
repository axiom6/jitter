(function() {
  var Body;

  Body = (function() {
    class Body {
      constructor(stream) {
        this.stream = stream;
      }

      ready(pane, spec) {
        var $e, src;
        src = "img/body/BodyReady.jpg";
        $e = $(`<div ${Jitter.rel(0, 0, 100, 100)}></div>`);
        $e.append(`<h1 ${Jitter.abs(0, 0, 100, 10)}>${spec.name}</h1>`);
        $e.append(`  ${Jitter.abi(0, 10, 100, 90, src, 150)}`);
        pane.$.append($e);
      }

      create(pane, spec) {
        var $e, j, k, len, len1, ref, ref1, x, y;
        $e = $(`<div   ${Jitter.rel(0, 0, 100, 100)}></div>`);
        $e.append(`<h1 ${Jitter.abs(0, 0, 100, 10)}>${spec.name}</h1>`);
        ref = [10, 55];
        for (j = 0, len = ref.length; j < len; j++) {
          y = ref[j];
          ref1 = [0, 33, 66];
          for (k = 0, len1 = ref1.length; k < len1; k++) {
            x = ref1[k];
            $e.append(`<div ${Jitter.abs(x, y, 33, 45)}>${x}</div>`);
          }
        }
        pane.$.append($e);
      }

      create(pane, spec) {
        var $e, array, i, j, k, len, len1, ref, ref1, where, x, y;
        $e = $(`<div   ${Jitter.rel(0, 0, 100, 100)}></div>`);
        $e.append(`<h1 ${Jitter.abs(0, 0, 100, 10)}>${spec.name}</h1>`);
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
            $e.append(`<div ${Jitter.abs(x, y, 33, 45)}>\n  <h3>${array[i].name}</h3>\n  <h3>${array[i].weight}</h3>\n  <h3>${array[i].texture}</h3>\n</div>`);
            i = i + 1;
          }
        }
        pane.$.append($e);
      }

    };

    Jitter.Body = Body;

    return Body;

  }).call(this);

}).call(this);
