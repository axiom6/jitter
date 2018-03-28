(function() {
  var Flavor;

  Flavor = (function() {
    class Flavor {
      constructor(stream) {
        this.resize = this.resize.bind(this);
        this.stream = stream;
        this.wheel = new Vis.Wheel(this.stream);
        this.srcLg = "img/logo/JitterBoxLogo.png";
        this.srcRx = "img/logo/JitterBoxRx.png";
        this.srcRy = "img/logo/JitterBoxRy.png";
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
        url = study != null ? "json/" + study.json + ".json" : "json/flavor.choice.json";
        scale = 0.9; // if study? then study.scale else 1.25
        divId = Util.getHtmlId("Wheel", name);
        pane.$.append(`     ${Jitter.image(0, 4, 100, 10, this.srcLg, 15, "", "24px")}`);
        pane.$.append(`     ${Jitter.image(-4, 0, 15, 10, this.srcRy, 30, "", "24px")}`);
        pane.$.append(`     ${Jitter.image(75, 0, 15, 10, this.srcRx, 30, "", "24px")}`);
        pane.$.append(`<div ${Jitter.panel(0, 5, 100, 95)} id="${divId}"></div>`);
        this.wheel.ready(pane, spec, divId, url, scale);
        window.addEventListener("resize", this.resize);
      }

      resize() {
        this.pane.geo = this.pane.geom();
        return this.wheel.resize();
      }

      create(pane, spec) {
        Util.noop(pane, spec);
      }

    };

    Jitter.Flavor = Flavor;

    return Flavor;

  }).call(this);

}).call(this);
