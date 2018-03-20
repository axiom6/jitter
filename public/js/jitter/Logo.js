(function() {
  var Logo;

  Logo = (function() {
    class Logo {
      constructor(stream) {
        this.doClick = this.doClick.bind(this);
        this.stream = stream;
        this.chosen = false;
        this.$wheelLogo = null;
        this.src = "img/logo/JitterBoxLogo.png";
      }

      overview(pane, spec) {
        Util.noop(pane, spec);
      }

      ready(pane, spec) {
        var $img;
        Util.noop(spec);
        pane.$.append(`<div ${Jitter.panel(0, 0, 100, 100)}></div>`);
        $img = $(`     ${Jitter.image(0, 0, 100, 100, this.src, 15, "", "24px")}`);
        $img.on('click', (event) => {
          return this.doClick(event);
        });
        pane.$.append($img);
      }

      doClick(event) {
        var htm, mh, mw, wheel;
        Util.noop(event);
        wheel = Jitter.page.flavor.wheel;
        this.chosen = this.chosen ? false : true;
        if (this.chosen) {
          wheel.$div.hide();
          if (this.$wheelLogo == null) {
            mh = wheel.pane.geo.h * 0.12;
            mw = wheel.pane.geo.w * 0.10;
            htm = "<div style=\"display:table; width:100%; height:100%;\">";
            htm += "<div style=\"display:table-cell; vertical-align:middle;\">";
            htm += `<img style="display:block; margin-left:auto; margin-right:auto; max-width:${mw}vmin; max-height:${mh}vmin; border-radius:24px;" src="${this.src}"/>`;
            htm += "</div></div>";
            this.$wheelLogo = $(htm);
            wheel.pane.$.append(this.$wheelLogo);
          } else {
            if (this.$wheelLogo != null) {
              this.$wheelLogo.show();
            }
          }
        } else {
          if (this.$wheelLogo != null) {
            this.$wheelLogo.hide();
          }
          wheel.$div.show();
        }
      }

      create(pane, spec) {
        Util.noop(pane, spec);
      }

    };

    Jitter.Logo = Logo;

    return Logo;

  }).call(this);

}).call(this);
