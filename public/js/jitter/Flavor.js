(function() {
  var Flavor;

  Flavor = (function() {
    class Flavor {
      constructor(stream) {
        this.resize = this.resize.bind(this);
        this.stream = stream;
        this.wheel = new Vis.Wheel(this.stream);
      }

      overview(pane, spec) {
        var $e, src;
        src = "img/flavor/FlavorReady.png";
        $e = $(`<div ${Jitter.panel(0, 0, 100, 100)}></div>`);
        $e.append(`<h1 ${Jitter.label(0, 0, 100, 10)}>${spec.name}</h1>`);
        $e.append(`  ${Jitter.image(0, 10, 100, 90, src, 150)}`);
        pane.$.append($e);
      }

      ready(pane, spec, study) {
        var divId, name, scale, url;
        [this.pane, this.spec, this.study] = [pane, spec, study];
        pane.$.empty();
        name = study != null ? study.name : "Jitter";
        url = study != null ? "json/" + study.json + ".json" : "json/flavor.jitter.json";
        scale = study != null ? study.scale : 1.25;
        divId = Util.getHtmlId("Wheel", name);
        pane.$.append(`<div ${Jitter.panel(0, 0, 100, 100)} id="${divId}"></div>`);
        pane.$.append(`<div ${Jitter.label(41, 49, 20, 10)}>Flavor</div>`);
        this.wheel.ready(pane, spec, divId, url, scale);
        window.addEventListener("resize", this.resize);
      }

      resize() {
        this.pane.geo = this.pane.geom();
        return this.ready(this.pane, this.spec, this.study);
      }

      create(pane, spec) {
        Util.noop(pane, spec);
      }

    };

    Jitter.Flavor = Flavor;

    return Flavor;

  }).call(this);

}).call(this);
