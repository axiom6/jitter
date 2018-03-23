(function() {
  var Roast,
    hasProp = {}.hasOwnProperty;

  Roast = (function() {
    class Roast {
      constructor(stream) {
        this.doInput = this.doInput.bind(this);
        this.doClick = this.doClick.bind(this);
        this.stream = stream;
        this.max = 100;
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
        var $r, dx, key, n, ref, roast, spans, src, style, x;
        [this.pane, this.spec] = [pane, spec];
        src = "img/roast/RoastsBig.png";
        n = Util.lenObject(Roast.Roasts);
        x = 0;
        dx = 100 / n; // - 0.07
        pane.$.append(`<div ${Jitter.panel(0, 0, 100, 100)}></div>`);
        style = "position:absolute; left:2%; top:5%; width:9%; height:90% ;";
        style += `text-align:center; background:${Roast.Roasts["5"].color}; `;
        style += "border:black solid 2px; color:white; font-size:3vmin; font-weight:bold; display: table;";
        spans = " display: table-cell; vertical-align: middle; line-height: normal; ";
        pane.$.append(`<div id="RoastColor" style="${style}"><span style="${spans}">${spec.name}</span></div>`);
        $r = $(`<div ${Jitter.label(13, 5, 84, 90, "roast")}></div>`);
        $r.append(`<img style="width:100%; height:75%;" src="${src}"/>`);
        style = `position:absolute; left:0; top:81%; width:100%; height:${16}% ;`;
        style += "padding:0; margin:0; z-index:2;";
        $r.append(`<input id="RoastInput" type="range" min="0" max="${this.max}" style="${style}"></input>`);
        ref = Roast.Roasts;
        
        for (key in ref) {
          if (!hasProp.call(ref, key)) continue;
          roast = ref[key];
          style = `position:absolute; left:${x}%; top:0; width:${dx}%; height:${75}%; `;
          style += "text-align:center; background:transparent ;";
          style += "border:black solid 1px;";
          if (key === "9") {
            style += "border-right:black solid 3px;";
          }
          $r.append(`<div style="${style}"></div>`);
          style = `position:absolute; left:${x}%; top:${75}%; width:${dx}%; height:${25}% ;`;
          style += `text-align:center; background:${roast.color} ;`;
          style += "border:black solid 2px;";
          $r.append(`<div style="${style}"></div>`);
          x = x + dx;
        }
        pane.$.append($r);
        $("#RoastInput").on("change", (event) => {
          return this.doInput(event);
        });
      }

      doInput(event) {
        var h1, h2, m, n, p, p1, p2, r, rgb, s, v;
        v = parseInt(event.target.value);
        n = 9;
        s = this.max / n;
        p = Math.min(Math.ceil(v / s), n);
        [p, m] = p < 1 ? [1, s / 2] : [p, (p + 0.5) * s];
        [p1, p2, r] = v > m && p < n - 1 ? [p, p + 1, (v - m) / n] : v < m && p >= 2 ? [p - 1, p, 1 - (m - v) / n] : [p, p, 1];
        console.log("doInput1", {
          v: v,
          m: m,
          r,
          p1: p1,
          p: p,
          p2: p2,
          s: s
        });
        h1 = Vis.cssHex(Roast.Roasts[p1].color);
        h2 = Vis.cssHex(Roast.Roasts[p2].color);
        rgb = Vis.rgbCss(Vis.interpolateHexRgb(h1, 1.0 - r, h2, r));
        $("#RoastColor").css({
          background: rgb
        });
        this.publish(Roast.Roasts[p].name, null, v);
      }

      doClick(event) {
        var $e, color, name;
        $e = $(event.target);
        name = $e.text();
        color = this.publish(name, $e = null);
        $e.css({
          color: color
        });
      }

      publish(name, $e = null, v = void 0) {
        var addDel, choice, color, key, study;
        key = name.replace(" ", "");
        study = this.spec[key];
        study.chosen = !((study.chosen != null) || study.chosen) ? true : false;
        addDel = study.chosen ? UI.AddChoice : UI.DelChoice;
        color = study.chosen ? Jitter.choiceColor : Jitter.basisColor;
        choice = UI.select('Roast', 'Jitter', addDel, name);
        if (v != null) {
          choice.value = v;
        }
        //choice.$click = $e if $e?
        console.log("Roast.publish", choice);
        Jitter.stream.publish('Choice', choice);
        return color;
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
        color: "#ad8d70",
        img: "1d.png",
        name: "Ultra Light"
      },
      "2": {
        color: "#99795f",
        img: "2d.png",
        name: "Very Light"
      },
      "3": {
        color: "#8d6b54",
        img: "3d.png",
        name: "Light"
      },
      "4": {
        color: "#826349",
        img: "4d.png",
        name: "Medium Light"
      },
      "5": {
        color: "#746457",
        img: "5d.png",
        name: "Medium"
      },
      "6": {
        color: "#67625e",
        img: "6d.png",
        name: "Medium Dark"
      },
      "7": {
        color: "#555b57",
        img: "7d.png",
        name: "Dark"
      },
      "8": {
        color: "#494a45",
        img: "8d.png",
        name: "Very Dark"
      },
      "9": {
        color: "#3e3f3a",
        img: "9d.png",
        name: "Ultra Dark"
      }
    };

    Roast.RoastsBak = {
      "1": {
        color: "#ad8d70",
        img: "1d.png"
      },
      "2": {
        color: "#7b835a",
        img: "2d.png"
      },
      "3": {
        color: "#99795f",
        img: "3d.png"
      },
      "4": {
        color: "#826349",
        img: "4d.png"
      },
      "5": {
        color: "#72654d",
        img: "5d.png"
      },
      "6": {
        color: "#67625e",
        img: "6d.png"
      },
      "7": {
        color: "#615b57",
        img: "7d.png"
      },
      "8": {
        color: "#494a45",
        img: "8d.png"
      },
      "9": {
        color: "#3e3f3a",
        img: "9d.png"
      }
    };

    Roast.Roasts5 = {
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
