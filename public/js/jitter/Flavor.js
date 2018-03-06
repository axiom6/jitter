(function() {
  var Flavor;

  Flavor = (function() {
    class Flavor {
      constructor(stream) {
        this.stream = stream;
        this.wheel = new Vis.Wheel();
      }

      ready(pane, spec) {
        var $e, src;
        src = "img/flavor/FlavorReady.png";
        $e = $(`<div ${Jitter.rel(0, 0, 100, 100)}></div>`);
        $e.append(`<h1 ${Jitter.abs(0, 0, 100, 10)}>${spec.name}</h1>`);
        $e.append(`  ${Jitter.abi(0, 10, 100, 90, src, 150)}`);
        pane.$.append($e);
      }

      create(pane, spec, study) {
        var divId, name, url;
        name = study != null ? study.name : "Jitter";
        url = study != null ? "json/" + study.json + ".json" : "json/flavor.jitter.json";
        divId = Util.getHtmlId("Wheel", name);
        pane.$.append(`<h1>${spec.name} ${name}</h1>`);
        pane.$.append(`<div id="${divId}">&nbsp;</div>`);
        this.wheel.create(pane, spec, divId, url);
      }

    };

    Jitter.Flavor = Flavor;

    return Flavor;

  }).call(this);

}).call(this);
