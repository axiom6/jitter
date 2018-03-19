(function() {
  var Aroma;

  Aroma = (function() {
    class Aroma {
      constructor(stream) {
        this.stream = stream;
        this.wheel = new Vis.Wheel();
      }

      overview(pane, spec) {
        var $e, src;
        src = "img/aroma/AromaReady.png";
        $e = $(`<div ${Jitter.panel(0, 0, 100, 100)}></div>`);
        $e.append(`<h1 ${Jitter.label(0, 0, 100, 10)}>${spec.name}</h1>`);
        $e.append(`  ${Jitter.image(0, 10, 100, 90, src, 150)}`);
        pane.$.append($e);
      }

      ready(pane, spec) {
        var $tree, callback, url;
        this.pane = pane;
        this.spec = spec;
        pane.$.append(`<div ${Jitter.panel(0, 0, 100, 100)}></div>`);
        pane.$.append(`<div ${Jitter.label(0, 2, 100, 10)}>${spec.name}</div>`);
        $tree = $(`<div ${Jitter.label(0, 7, 100, 87)}></div>`);
        url = "json/aroma3.json";
        callback = (data) => {
          this.html($tree, data.children, 16, 1);
          return pane.$.append($tree);
        };
        UI.readJSON(url, callback);
      }

      html($p, children, pad, level) {
        var $d, i, len, obj, study;
        for (i = 0, len = children.length; i < len; i++) {
          obj = children[i];
          $d = $(`<div class="branch" style="padding-left:${pad}px; text-align:left">${obj.name}</div>`);
          study = {
            name: obj.name,
            chosen: false
          };
          if (level === 2) {
            Jitter.onEvents($d, this.spec, obj.name, study);
          }
          $p.append($d);
          if (obj.children != null) {
            this.html($p, obj.children, pad + 12, level + 1);
          }
        }
      }

      create(pane, spec) {
        var divId, url;
        divId = Util.htmlId("Wheel", "Aroma");
        url = "json/aroma4.json";
        pane.$.append(`<div ${Jitter.panel(0, 0, 100, 100)} id="${divId}"></div>`);
        pane.$.append(`<div ${Jitter.label(40.5, 49, 20, 10)}>Aroma</div>`);
        this.wheel.create(pane, spec, divId, url);
      }

    };

    Jitter.Aroma = Aroma;

    return Aroma;

  }).call(this);

}).call(this);
