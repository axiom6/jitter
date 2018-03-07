(function() {
  var Brew,
    hasProp = {}.hasOwnProperty;

  Brew = (function() {
    class Brew {
      constructor(stream) {
        this.stream = stream;
      }

      overview(pane, spec) {
        var $e, src;
        src = "img/brew/" + spec['AutoDrip'].icon;
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
          src = "img/brew/" + array[i].icon;
          $e.append(`${Jitter.abi(x, y, 100, 13, src, 80, array[i].name)}`);
          i = i + 1;
        }
        pane.$.append($e);
      }

      create(pane, spec) {
        /*
        $e.append( """<div     #{Jitter.abs(x,y,w,h)}>
                               #{Jitter.img(src)}
                          <div #{Jitter.txt()}>#{brew.name}</div>
                      </div>""" )
         */
        var $e, brew, h, i, key, src, w, x, y;
        pane.$.append("<h1>Brew</h1>");
        $e = $(`<div ${Jitter.rel(0, 0, 100, 100)}></div>`);
        i = 1;
        x = 0;
        w = 25;
        h = 25;
        for (key in spec) {
          if (!hasProp.call(spec, key)) continue;
          brew = spec[key];
          if (!(UI.isChild(key))) {
            continue;
          }
          src = 'img/brew/' + brew.icon;
          x = i !== 4 ? x + 25 : 0;
          y = i <= 4 ? 10 : 50;
          if (i === 5) {
            x = 12.5;
          }
          $e.append(`${Jitter.abi(x, y, w, h, src, 150, brew.name)}`);
          i = i + 1;
        }
        pane.$.append($e);
      }

    };

    Jitter.Brew = Brew;

    return Brew;

  }).call(this);

}).call(this);
