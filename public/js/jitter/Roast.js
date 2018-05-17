import Util    from '../util/Util.js';
import UI      from '../ui/UI.js';
import Dom     from '../ui/Dom.js';
import Vis     from '../vis/Vis.js';
var Roast,
  hasProp = {}.hasOwnProperty;

Roast = (function() {
  class Roast {
    constructor(stream, ui) {
      this.readyView = this.readyView.bind(this);
      this.doInputEvent = this.doInputEvent.bind(this);
      this.doInput = this.doInput.bind(this);
      this.doClick = this.doClick.bind(this);
      this.onChoice = this.onChoice.bind(this);
      this.stream = stream;
      this.ui = ui;
      this.ui.addContent('Roast', this);
      this.max = 90;
      this.data = Roast.Table;
      this.stream.subscribe('Choice', 'Roast', (choice) => {
        return this.onChoice(choice);
      });
    }

    readyView() {
      return $("<h1 style=\" display:grid; justify-self:center; align-self:center; \">Roast</h1>");
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
        return this.doInputEvent(event);
      });
      $p.append($r);
      return $p;
    }

    doInputEvent(event) {
      var value;
      value = parseInt(event.target.value);
      return this.doInput(value, true);
    }

    doInput(v, pub) {
      var h1, h2, m, n, p, p1, p2, r, rgb, s;
      n = 9;
      s = this.max / n;
      p = Math.min(Math.ceil(v / s), n);
      [p, m] = p < 1 ? [1, s / 2] : [p, (p - 0.5) * s];
      [p1, p2, r] = v >= m && p < n - 1 ? [p, p + 1, (v - m) / n] : v < m && p >= 2 ? [p - 1, p, 1 - (m - v) / n] : [p, p, 1];
      //console.log( "doInput1", { v:v, m:m, r, p1:p1, p:p, p2:p2, s:s } )
      h1 = Vis.cssHex(this.data[p1].color);
      h2 = Vis.cssHex(this.data[p2].color);
      rgb = Vis.rgbCss(Vis.interpolateHexRgb(h1, 1.0 - r, h2, r));
      if (this.$pane != null) {
        this.$pane.find("#RoastColor").css({
          background: rgb
        });
      }
      if (pub) {
        this.publish(this.data[p], null, v);
      }
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
      this.spec.num++;
      if (this.spec.num <= this.spec.max) {
        choice = UI.select('Roast', 'Roast', addDel, name);
        if (v != null) {
          choice.value = v;
        }
        this.stream.publish('Choice', choice);
      } else {
        this.spec.num--;
        alert(`You can only make ${this.spec.max} choices for Roast`);
      }
      return color;
    }

    onChoice(choice) {
      var value;
      if (choice.name !== 'Roast' || choice.source === 'Roast') {
        return;
      }
      if (this.stream.isInfo('Choice')) {
        console.info('Roast.onChoice()', choice);
      }
      value = choice.value != null ? choice.value : this.getValue(choice.study);
      this.doInput(value, false);
    }

    getValue(name) {
      var key, ref, roast;
      ref = Roast.Table;
      for (key in ref) {
        roast = ref[key];
        if (roast.name === name) {
          return roast.value;
        }
      }
      console.error(`Roast.getValue() roast ${name} missing return average value of 45`);
      return 45;
    }

  };

  Roast.Table = {
    "1": {
      color: "#dba34e",
      img: "1d.png",
      name: "Blonde",
      value: 5,
      style: "Half City"
    },
    "2": {
      color: "#c48a43",
      img: "2d.png",
      name: "Light",
      value: 15,
      style: "Cinnamon"
    },
    "3": {
      color: "#996b31",
      img: "3d.png",
      name: "City",
      value: 25,
      style: "City"
    },
    "4": {
      color: "#795424",
      img: "4d.png",
      name: "Full",
      value: 35,
      style: "Full City"
    },
    "5": {
      color: "#6d4a1f",
      img: "5d.png",
      name: "Medium",
      value: 45,
      style: "Full City Plus"
    },
    "6": {
      color: "#553916",
      img: "6d.png",
      name: "Vienna",
      value: 55,
      style: "Vienna"
    },
    "7": {
      color: "#492c0f",
      img: "7d.png",
      name: "Dark",
      value: 65,
      style: "Italian"
    },
    "8": {
      color: "#40250d",
      img: "8d.png",
      name: "French",
      value: 75,
      style: "French"
    },
    "9": {
      color: "#2f1c09",
      img: "9d.png",
      name: "Black",
      value: 85,
      style: "Black"
    }
  };

  return Roast;

}).call(this);

export default Roast;
