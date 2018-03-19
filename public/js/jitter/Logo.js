(function() {
  var Logo;

  Logo = (function() {
    class Logo {
      constructor(stream) {
        this.stream = stream;
      }

      overview(pane, spec) {
        Util.noop(pane, spec);
      }

      ready(pane, spec) {
        var $img, src;
        Util.noop(spec);
        src = "img/logo/JitterBoxLogo.png";
        pane.$.append(`<div ${Jitter.panel(0, 0, 100, 100)}></div>`);
        $img = $(`     ${Jitter.image(0, 0, 100, 100, src, 15, "", "24px")}`);
        //img.on( 'mouseenter', $img.css( { "max-height":"1000px" } ) )
        //img.on( 'mouseleave', $img.css( { "max-height":"15vmin" } ) )
        pane.$.append($img);
      }

      create(pane, spec) {
        Util.noop(pane, spec);
      }

    };

    Jitter.Logo = Logo;

    return Logo;

  }).call(this);

}).call(this);
