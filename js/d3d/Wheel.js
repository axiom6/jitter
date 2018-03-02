// Generated by CoffeeScript 1.6.3
(function() {
  var Radar, Vis, Wheel,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Radar = require('js/d3d/Radar');

  Vis = require('js/util/Vis');

  Wheel = (function(_super) {
    __extends(Wheel, _super);

    module.exports = Wheel;

    function Wheel(g, width, height) {
      var dr;
      this.g = g;
      if (width == null) {
        width = 1200;
      }
      if (height == null) {
        height = 800;
      }
      this.quadrants = [
        {
          name1: "Red",
          key: '0',
          color: "hsl(  0,100%,50%)",
          beg: -15,
          end: 15
        }, {
          name1: "Orange",
          key: '30',
          color: "hsl( 30,100%,50%)",
          beg: 15,
          end: 45
        }, {
          name1: "Yellow",
          key: '60',
          color: "hsl( 60,100%,50%)",
          beg: 45,
          end: 75
        }, {
          name1: "Lime",
          key: '90',
          color: "hsl( 90,100%,50%)",
          beg: 75,
          end: 105
        }, {
          name1: "Green",
          key: '120',
          color: "hsl(120,100%,50%)",
          beg: 105,
          end: 135
        }, {
          name1: "Teal",
          key: '150',
          color: "hsl(150,100%,50%)",
          beg: 135,
          end: 165
        }, {
          name1: "Cyan",
          key: '180',
          color: "hsl(180,100%,50%)",
          beg: 165,
          end: 195
        }, {
          name1: "Azure",
          key: '210',
          color: "hsl(210,100%,50%)",
          beg: 195,
          end: 225
        }, {
          name1: "Blue",
          key: '240',
          color: "hsl(240,100%,50%)",
          beg: 225,
          end: 255
        }, {
          name1: "Violet",
          key: '270',
          color: "hsl(270,100%,50%)",
          beg: 255,
          end: 285
        }, {
          name1: "Magenta",
          key: '300',
          color: "hsl(300,100%,50%)",
          beg: 285,
          end: 315
        }, {
          name1: "Pink",
          key: '330',
          color: "hsl(330,100%,50%)",
          beg: 315,
          end: 345
        }
      ];
      this.palettes = [
        {
          palette: Vis.Palettes.reds,
          name1: "Red",
          key: '0',
          beg: -15,
          end: 15
        }, {
          palette: Vis.Palettes.browns,
          name1: "Brown",
          key: '20',
          beg: 15,
          end: 25
        }, {
          palette: Vis.Palettes.tans,
          name1: "Tan",
          key: '30',
          beg: 25,
          end: 35
        }, {
          palette: Vis.Palettes.oranges,
          name1: "Orange",
          key: '40',
          beg: 35,
          end: 45
        }, {
          palette: Vis.Palettes.yellows,
          name1: "Yellow",
          key: '60',
          beg: 45,
          end: 75
        }, {
          palette: Vis.Palettes.limes,
          name1: "Lime",
          key: '90',
          beg: 75,
          end: 105
        }, {
          palette: Vis.Palettes.greens,
          name1: "Green",
          key: '120',
          beg: 105,
          end: 135
        }, {
          palette: Vis.Palettes.teals,
          name1: "Teal",
          key: '150',
          beg: 135,
          end: 165
        }, {
          palette: Vis.Palettes.cyans,
          name1: "Cyan",
          key: '180',
          beg: 165,
          end: 195
        }, {
          palette: Vis.Palettes.azures,
          name1: "Azure",
          key: '210',
          beg: 195,
          end: 225
        }, {
          palette: Vis.Palettes.blues,
          name1: "Blue",
          key: '240',
          beg: 225,
          end: 255
        }, {
          palette: Vis.Palettes.violets,
          name1: "Violet",
          key: '270',
          beg: 255,
          end: 285
        }, {
          palette: Vis.Palettes.magentas,
          name1: "Magenta",
          key: '300',
          beg: 285,
          end: 315
        }, {
          palette: Vis.Palettes.pinks,
          name1: "Pink",
          key: '330',
          beg: 315,
          end: 330
        }, {
          palette: Vis.Palettes.grays,
          name1: "Gray",
          key: '345',
          beg: 330,
          end: 345
        }
      ];
      this.assoc = this.assocQuad(this.quadrants);
      Wheel.__super__.constructor.call(this, this.g, false, width, height);
      dr = (this.r100 - this.r40) / 30;
      this.quads(this.hueQuads(10), this.r80, this.r100);
    }

    Wheel.prototype.hueQuads = function(inc) {
      var a, hue, _i;
      a = [];
      for (hue = _i = 0; _i < 360; hue = _i += inc) {
        a.push({
          name1: this.name1(hue),
          color: "hsla(" + hue + ",100%,50%,1.0)",
          beg: hue - inc / 2,
          end: hue + inc / 2
        });
      }
      return a;
    };

    Wheel.prototype.hueWedges = function(dh, dr, r1, r2) {
      var g, hue, lite, r, _i, _j;
      g = this.g.selectAll("g").append("svg:g");
      for (hue = _i = 0; _i < 360; hue = _i += dh) {
        for (r = _j = r1; dr > 0 ? _j < r2 : _j > r2; r = _j += dr) {
          lite = 80 - (r - r1) / (r2 - r1) * 50;
          this.wedge("hsla(" + hue + ",100%," + lite + "%,1.0)", g, r, r + dr, hue - dh / 2, hue + dh / 2);
        }
      }
      this.grid(dh);
    };

    Wheel.prototype.hsvWedges = function(dh, dr, r1, r2) {
      var g, hue, r, sat, _i, _j;
      g = this.g.selectAll("g").append("svg:g");
      for (hue = _i = 0; _i < 360; hue = _i += dh) {
        for (r = _j = r1; dr > 0 ? _j < r2 : _j > r2; r = _j += dr) {
          sat = 0.3 + (r - r1) / (r2 - r1) * 0.7;
          this.wedge(Vis.rgbCss(Vis.hsvToRgb({
            h: hue,
            s: sat,
            v: 1
          })), g, r, r + dr, hue - dh / 2, hue + dh / 2);
        }
      }
      this.grid(dh, dr, -dh / 2, 360 - dh / 2);
    };

    Wheel.prototype.paletteWedges = function(dh, dr, r1, r2) {
      var c, g, palette, r, _i, _j, _len, _len1, _ref, _ref1;
      Util.noop(r2);
      g = this.g.selectAll("g").append("svg:g");
      _ref = this.palettes;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        palette = _ref[_i];
        r = r1;
        _ref1 = palette.palette;
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          c = _ref1[_j];
          this.wedge(c.hex, g, r, r + dr, palette.beg, palette.end);
          r += dr;
        }
      }
    };

    Wheel.prototype.paletteLogs = function() {
      var c, hex, hsl, hsv, palette, _i, _j, _len, _len1, _ref, _ref1;
      _ref = this.palettes;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        palette = _ref[_i];
        _ref1 = palette.palette;
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          c = _ref1[_j];
          hex = '"' + c.hex + '"';
          hsv = '"' + Vis.hsvRgb(Vis.hexRgb(c.hex)) + '"';
          hsl = '"' + Vis.hslRgb(Vis.hexRgb(c.hex)) + '"';
          Util.dbg('    ', {
            hex: hex,
            hsv: hsv,
            hsl: hsl,
            code: '"HTML"',
            name: '"' + c.name + '"'
          });
        }
      }
    };

    Wheel.prototype.name1 = function(hue) {
      var qa;
      qa = this.assoc[hue.toString()];
      if (qa != null) {
        return qa.name1;
      } else {
        return null;
      }
    };

    Wheel.prototype.assocQuad = function(quadrants) {
      var assoc, q, _i, _len;
      assoc = [];
      for (_i = 0, _len = quadrants.length; _i < _len; _i++) {
        q = quadrants[_i];
        assoc[q.key] = q;
      }
      return assoc;
    };

    return Wheel;

  })(Radar);

}).call(this);