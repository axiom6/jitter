(function() {
  var Aroma;

  Aroma = (function() {
    class Aroma {
      constructor(stream) {
        this.stream = stream;
        this.wheel = new Vis.Wheel();
      }

      ready(pane, spec) {
        var $e, src;
        src = "img/aroma/AromaReady.png";
        $e = $(`<div ${Jitter.rel(0, 0, 100, 100)}></div>`);
        $e.append(`<h1 ${Jitter.abs(0, 0, 100, 10)}>${spec.name}</h1>`);
        $e.append(`  ${Jitter.abi(0, 10, 100, 90, src, 150)}`);
        pane.$.append($e);
      }

      create(pane, spec) {
        UI.plotId = "AromaVisual";
        UI.jsonD3 = "json/aroma.json";
        pane.$.append(`<h1>${spec.name}</h1>`);
        pane.$.append(`<div id="${UI.plotId}">&nbsp;</div>`);
        Util.loadScript("js/wheel/flavor.v3.js");
      }

      create(pane, spec) {
        var divId, url;
        divId = Util.htmlId("Wheel", "Aroma");
        url = "json/aroma.json";
        pane.$.append(`<div ${Jitter.rel(0, 0, 100, 100)} id="${divId}"></div>`);
        pane.$.append(`<h1  ${Jitter.abs(0, 0, 100, 10)}>${spec.name}</h1>`);
        this.wheel.create(pane, spec, divId, url);
      }

    };

    Jitter.Aroma = Aroma;

    return Aroma;

  }).call(this);

}).call(this);
