(function() {
  var Body;

  Body = (function() {
    class Body {
      constructor(stream, jitter) {
        this.stream = stream;
        this.jitter = jitter;
        this.jitter.addContent('Body', this);
      }

      readyPane() {
        return UI.Dom.vert(this.stream, this.spec, 'img/body/', 0.75, 0, 10);
      }

      readyView() {
        var src;
        src = "img/body/Body.jpg";
        this.$view = $(`<div ${UI.Dom.panel(0, 0, 100, 100)}></div>`);
        this.$view.append(`<h1 ${UI.Dom.label(0, 0, 100, 10)}>Body</h1>`);
        this.$view.append(`  ${UI.Dom.image(0, 10, 100, 90, src, 150)}`);
        return this.$view;
      }

    };

    Jitter.Body = Body;

    return Body;

  }).call(this);

}).call(this);
