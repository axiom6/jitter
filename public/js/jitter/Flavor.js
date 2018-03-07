(function() {
  var Flavor;

  Flavor = (function() {
    class Flavor {
      constructor(stream) {
        this.stream = stream;
        this.wheel = new Vis.Wheel();
      }

      overview(pane, spec) {
        var $e, src;
        src = "img/flavor/FlavorReady.png";
        $e = $(`<div ${Jitter.rel(0, 0, 100, 100)}></div>`);
        $e.append(`<h1 ${Jitter.abs(0, 0, 100, 10)}>${spec.name}</h1>`);
        $e.append(`  ${Jitter.abi(0, 10, 100, 90, src, 150)}`);
        pane.$.append($e);
      }

      ready(pane, spec) {
        this.create(pane, spec);
      }

      create(pane, spec, study) {
        var divId, name, url;
        name = study != null ? study.name : "Jitter";
        url = study != null ? "json/" + study.json + ".json" : "json/flavor.wheel.json";
        divId = Util.getHtmlId("Wheel", name);
        pane.$.append(`<div ${Jitter.rel(0, 0, 100, 100)} id="${divId}"></div>`);
        pane.$.append(`<h1  ${Jitter.abs(0, 0, 100, 10)}>${name}</h1>`);
        this.wheel.create(pane, spec, divId, url);
      }

    };

    Jitter.Flavor = Flavor;

    return Flavor;

  }).call(this);

}).call(this);
