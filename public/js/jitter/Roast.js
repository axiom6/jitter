(function() {
  var Roast,
    hasProp = {}.hasOwnProperty;

  Roast = (function() {
    class Roast {
      constructor(stream) {
        this.doClick = this.doClick.bind(this);
        this.stream = stream;
      }

      overview(pane, spec) {
        var $e, src;
        src = "img/roast/Coffee-Bean-Roast-Ready.jpg";
        $e = $(`<div ${Jitter.panel(0, 0, 100, 100)}></div>`);
        $e.append(`<h1 ${Jitter.label(0, 0, 100, 10)}>${spec.name}</h1>`);
        $e.append(`  ${Jitter.image(0, 10, 100, 90, src, 150)}`);
        pane.$.append($e);
      }

      ready(pane, spec) {
        var $r, $s, dir, dx, key, n, ref, roast, src, x;
        [this.pane, this.spec] = [pane, spec];
        dir = "img/roast/";
        n = Util.lenObject(Roast.Roasts);
        x = 0;
        dx = 100 / n;
        pane.$.append(`<div ${Jitter.panel(0, 0, 100, 100)}></div>`);
        pane.$.append(`<div ${Jitter.label(3, 42, 7, 16)}>${spec.name}</div>`);
        $r = $(`<div ${Jitter.label(10, 5, 90, 85, "roast")}></div>`);
        ref = Roast.Roasts;
        for (key in ref) {
          if (!hasProp.call(ref, key)) continue;
          roast = ref[key];
          src = dir + roast.img;
          $s = $(`<div ${Jitter.label(x, 0, dx, 100, "roast")}></div>`);
          $s.append(`<img style="width:80px; height:80px;" src="${src}"/>`);
          $s.append(`<div style="width:100%; height:20%; background:${roast.color};"></div>`);
          $r.append($s);
          x = x + dx;
        }
        pane.$.append($r);
      }

      ready1(pane, spec) {
        var $i, src;
        [this.pane, this.spec] = [pane, spec];
        src = "img/roast/RoastsBig.png";
        pane.$.append(`<div   ${Jitter.panel(0, 0, 100, 100)}></div>`);
        pane.$.append(`<div ${Jitter.label(3, 42, 10, 16)}>${spec.name}</div>`);
        $i = $(`${this.image(16, 8, 75, 78, src, 15)}`);
        $i.append(`<div ${Jitter.label(3, 82, 16, 10, "roast")}>Light</div>`);
        $i.append(`<div ${Jitter.label(24, 82, 16, 10, "roast")}>Medium Light</div>`);
        $i.append(`<div ${Jitter.label(42, 82, 16, 10, "roast")}>Medium</div>`);
        $i.append(`<div ${Jitter.label(66, 82, 16, 10, "roast")}>Medium Dark</div>`);
        $i.append(`<div ${Jitter.label(86, 82, 16, 10, "roast")}>Dark</div>`);
        pane.$.append($i);
        pane.$.append("</div></div>");
        $(".roast").on('click', (event) => {
          return this.doClick(event);
        });
      }

      doClick(event) {
        var $e, addDel, choice, color, key, name, study;
        $e = $(event.target);
        name = $e.text();
        key = name.replace(" ", "");
        study = this.spec[key];
        study.chosen = !((study.chosen != null) || study.chosen) ? true : false;
        addDel = study.chosen ? UI.AddChoice : UI.DelChoice;
        color = study.chosen ? Jitter.choiceColor : Jitter.basisColor;
        $e.css({
          color: color
        });
        choice = UI.select('Roast', 'Jitter', addDel, name);
        choice.$click = $e;
        Jitter.stream.publish('Choice', choice);
      }

      image(x, y, w, h, src, mh) { // max-height:#{mh}vmin;
        var htm, klass;
        klass = src != null ? "image" : "texts";
        htm = `<div class="${klass}" style="position:absolute; left:${x}%; top:${y}%; width:${w}%; height:${h}%; display:table;">`;
        htm += "<div style=\"display:table-cell; vertical-align:middle;\">";
        if (src != null) {
          htm += `<img style="display:block; margin-left:auto; margin-right:auto;  width:100%; max-height:${mh}vmin; border-radius:24px;" src="${src}"/>`;
        }
        return htm;
      }

      create(pane, spec) {
        var $e, src;
        pane.$.append(`<h1>${spec.name}</h1>`);
        $e = $(`<div ${Jitter.rel(0, 0, 100, 100)}></div>`);
        src = "img/roast/FiveRoasts.jpeg";
        $e.append(`<img ${Jitter.img(src)}/>`);
        //$e.append( """<div><span>Light</span><span>Medium Light</span><span>Medium</span><span>Medium Dark</span><span>Dark</span></div>""")
        pane.$.append($e);
      }

    };

    Jitter.Roast = Roast;

    Roast.Roasts = {
      "1": {
        color: "#a69c7f",
        img: "1.png"
      },
      "3": {
        color: "#8b7059",
        img: "3.png"
      },
      "6": {
        color: "#675346",
        img: "6.png"
      },
      "7": {
        color: "#6a5b4a",
        img: "7.png"
      },
      "8": {
        color: "#3d4037",
        img: "8.png"
      },
      "A": {
        color: "#141e1b",
        img: "A.png"
      }
    };

    Roast.Roasts10 = {
      "1": {
        color: "#a69c7f",
        img: "1.png"
      },
      "2": {
        color: "#b8927a",
        img: "2.png"
      },
      "3": {
        color: "#8b7059",
        img: "3.png"
      },
      "4": {
        color: "#7e8652",
        img: "4.png"
      },
      "5": {
        color: "#6b574a",
        img: "5.png"
      },
      "6": {
        color: "#675346",
        img: "6.png"
      },
      "7": {
        color: "#6a5b4a",
        img: "7.png"
      },
      "8": {
        color: "#3d4037",
        img: "8.png"
      },
      "9": {
        color: "#3c3f36",
        img: "9.png"
      },
      "A": {
        color: "#141e1b",
        img: "A.png"
      }
    };

    return Roast;

  }).call(this);

}).call(this);
