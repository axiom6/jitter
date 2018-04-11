import Util    from '../util/Util.js';
import UI      from '../ui/UI.js';
import Dom     from '../ui/Dom.js';
import Vis     from '../vis/Vis.js';
var Roast,
  hasProp = {}.hasOwnProperty;

Roast = (function() {
  class Roast {
    constructor(stream, ui) {
      this.doInput = this.doInput.bind(this);
      this.doClick = this.doClick.bind(this);
      this.stream = stream;
      this.ui = ui;
      this.ui.addContent('Roast', this);
      this.max = 100;
      this.data = Roast.Table;
    }

    readyView() {
      var src;
      src = "img/roast/Coffee-Bean-Roast-Ready.jpg";
      this.$view = $(`<div ${Dom.panel(0, 0, 100, 100)}></div>`);
      this.$view.append(`<h1 ${Dom.label(0, 0, 100, 10)}>Roast</h1>`);
      this.$view.append(`  ${Dom.image(0, 10, 100, 90, src, 150)}`);
      return this.$view;
    }

    readyPane() {
      var $p, $r, dx, key, n, ref, roast, spans, src, style, x;
      src = "img/roast/RoastsBig.png";
      n = Util.lenObject(this.data);
      x = 0;
      dx = 100 / n; // - 0.07
      $p = $(`<div ${Dom.panel(0, 0, 100, 100)}></div>`);
      $p.css({
        "background-color": "#8d6566",
        "border-radius": "24px"
      });
      style = "position:absolute; left:2%; top:5%; width:9%; height:90%; ";
      style += `text-align:center; background:${this.data["5"].color}; `;
      style += `border:black solid 2px; font-size:3vmin; font-weight:bold; display:table; opacity:${Dom.opacity}; `;
      spans = "display:table-cell; vertical-align:middle; line-height:normal; "; // opacity:1.0; z-index:4; color:white;
      $p.append(`<div id="RoastColor" style="${style}"><span style="${spans}">Roast</span></div>`);
      $r = $(`<div ${Dom.label(13, 5, 84, 90, "roast")}></div>`);
      $r.append(`<img style="width:100%; height:75%;" src="${src}"/>`);
      style = `position:absolute; left:0; top:81%; width:100%; height:${16}% ;`;
      style += "padding:0; margin:0; z-index:2;";
      $r.append(`<input id="RoastInput" type="range" min="0" max="${this.max}" style="${style}"></input>`);
      ref = this.data;
      
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
        style += `text-align:center; background:${roast.color}; opacity:${Dom.opacity};`;
        style += "border:black solid 2px;";
        $r.append(`<div style="${style}"></div>`);
        x = x + dx;
      }
      $r.find("#RoastInput").on("change", (event) => {
        return this.doInput(event);
      });
      $p.append($r);
      return $p;
    }

    doInput(event) {
      var h1, h2, m, n, p, p1, p2, r, rgb, s, v;
      v = parseInt(event.target.value);
      n = 9;
      s = this.max / n;
      p = Math.min(Math.ceil(v / s), n);
      [p, m] = p < 1 ? [1, s / 2] : [p, (p - 0.5) * s];
      [p1, p2, r] = v >= m && p < n - 1 ? [p, p + 1, (v - m) / n] : v < m && p >= 2 ? [p - 1, p, 1 - (m - v) / n] : [p, p, 1];
      //console.log( "doInput1", { v:v, m:m, r, p1:p1, p:p, p2:p2, s:s } )
      h1 = Vis.cssHex(this.data[p1].color);
      h2 = Vis.cssHex(this.data[p2].color);
      rgb = Vis.rgbCss(Vis.interpolateHexRgb(h1, 1.0 - r, h2, r));
      this.$pane.find("#RoastColor").css({
        background: rgb
      });
      this.publish(this.data[p], null, v);
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

    publish(study, $e = null, v = void 0) {
      var addDel, choice, color, name;
      name = study.name;
      study.chosen = !((study.chosen != null) || study.chosen) ? true : false;
      addDel = study.chosen ? UI.AddChoice : UI.DelChoice;
      color = study.chosen ? Dom.choiceColor : Dom.basisColor;
      choice = UI.select('Roast', 'Jitter', addDel, name);
      if (v != null) {
        choice.value = v;
      }
      //choice.$click = $e if $e?
      //console.log( "Roast.publish", choice )
      this.stream.publish('Choice', choice);
      return color;
    }

    // Not used
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

  };

  Roast.Table = {
    "1": {
      color: "#dba34e",
      img: "1d.png",
      name: "Blonde",
      style: "Half City"
    },
    "2": {
      color: "#c48a43",
      img: "2d.png",
      name: "Light",
      style: "Cinnamon"
    },
    "3": {
      color: "#996b31",
      img: "3d.png",
      name: "City",
      style: "City"
    },
    "4": {
      color: "#795424",
      img: "4d.png",
      name: "Full",
      style: "Full City"
    },
    "5": {
      color: "#6d4a1f",
      img: "5d.png",
      name: "Medium",
      style: "Full City Plus"
    },
    "6": {
      color: "#553916",
      img: "6d.png",
      name: "Vienna",
      style: "Vienna"
    },
    "7": {
      color: "#492c0f",
      img: "7d.png",
      name: "Dark",
      style: "Italian"
    },
    "8": {
      color: "#40250d",
      img: "8d.png",
      name: "French",
      style: "French"
    },
    "9": {
      color: "#2f1c09",
      img: "9d.png",
      name: "Black",
      style: "Black"
    }
  };

  return Roast;

}).call(this);

export default Roast;
