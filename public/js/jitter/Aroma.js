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
        $e = $(`<div ${Jitter.rel(0, 0, 100, 100)}></div>`);
        $e.append(`<h1 ${Jitter.abs(0, 0, 100, 10)}>${spec.name}</h1>`);
        $e.append(`  ${Jitter.abi(0, 10, 100, 90, src, 150)}`);
        pane.$.append($e);
      }

      ready(pane, spec) {
        var $e, $h, callback, url;
        $e = $(`<div ${Jitter.rel(0, 0, 100, 100)}></div>`);
        $e.append(`<h2  ${Jitter.abs(0, 0, 100, 10)}>${spec.name}</h2>`);
        $h = $(`<div ${Jitter.abs(0, 10, 100, 90)}></div>`);
        url = "json/aroma3.json";
        callback = (data) => {
          var htm;
          htm = this.html(data.children, 16);
          $h.append(htm);
          pane.$.append($e);
          return pane.$.append($h);
        };
        UI.readJSON(url, callback);
      }

      html(children, pad) {
        var htm, i, len, obj;
        htm = "";
        for (i = 0, len = children.length; i < len; i++) {
          obj = children[i];
          htm += `<div style="padding-left:${pad}px; font-size:14px; line-height:24px; color:white; text-align:left">${obj.name}</div>`;
          if (obj.children != null) {
            htm += this.html(obj.children, pad + 12);
          }
        }
        return htm;
      }

      create(pane, spec) {
        var divId, url;
        divId = Util.htmlId("Wheel", "Aroma");
        url = "json/aroma4.json";
        pane.$.append(`<div ${Jitter.rel(0, 0, 100, 100)} id="${divId}"></div>`);
        pane.$.append(`<div ${Jitter.abs(40.5, 49, 20, 10)}>Aroma</div>`);
        this.wheel.create(pane, spec, divId, url);
      }

    };

    Jitter.Aroma = Aroma;

    return Aroma;

  }).call(this);

}).call(this);
