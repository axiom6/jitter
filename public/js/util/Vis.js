"use strict";

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function () {
  var Vis;

  Vis = function () {
    var _Vis$FontAwesomeUnico;

    var Vis = function () {
      function Vis() {
        _classCallCheck(this, Vis);
      }

      _createClass(Vis, [{
        key: "rgbaStr",
        value: function rgbaStr() {
          var a, b, g, n, r;
          n = function n(f) {
            return Math.round(f);
          };

          var _rgba = _slicedToArray(this.rgba, 4);

          r = _rgba[0];
          g = _rgba[1];
          b = _rgba[2];
          a = _rgba[3];

          return "rgba(" + n(r) + "," + n(g) + "," + n(b) + "," + n(a) + ")";
        }
      }], [{
        key: "rad",
        value: function rad(deg) {
          return deg * Math.PI / 180;
        }
      }, {
        key: "deg",
        value: function deg(rad) {
          return rad * 180 / Math.PI;
        }
      }, {
        key: "sin",
        value: function sin(deg) {
          return Math.sin(Vis.rad(deg));
        }
      }, {
        key: "cos",
        value: function cos(deg) {
          return Math.cos(Vis.rad(deg));
        }
      }, {
        key: "rot",
        value: function rot(deg, ang) {
          var a;
          a = deg + ang;
          if (a < 0) {
            a = a + 360;
          }
          return a;
        }
      }, {
        key: "toRadian",
        value: function toRadian(h) {
          var hueIsRygb = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

          var hue, radian;
          hue = hueIsRygb ? Vis.toHueRygb(h) : h;
          radian = 2 * π * (90 - hue) / 360; // Correction for MathBox polar coordinate system
          if (radian < 0) {
            radian = 2 * π + radian;
          }
          return radian;
        }
      }, {
        key: "svgDeg",
        value: function svgDeg(deg) {
          return 360 - deg;
        }
      }, {
        key: "svgRad",
        value: function svgRad(rad) {
          return 2 * Math.PI - rad;
        }
      }, {
        key: "radSvg",
        value: function radSvg(deg) {
          return Vis.rad(360 - deg);
        }
      }, {
        key: "degSvg",
        value: function degSvg(rad) {
          return Vis.deg(2 * Math.PI - rad);
        }
      }, {
        key: "sinSvg",
        value: function sinSvg(deg) {
          return Math.sin(Vis.radSvg(deg));
        }
      }, {
        key: "cosSvg",
        value: function cosSvg(deg) {
          return Math.cos(Vis.radSvg(deg));
        }

        // => specified for methods to be used as callbacks

      }, {
        key: "chRgbHsl",
        value: function chRgbHsl(h, s, l) {
          return Vis.chroma.hsl(h, s, l).rgb();
        }
      }, {
        key: "chRgbHsv",
        value: function chRgbHsv(h, s, v) {
          return Vis.chroma.hsv(h, s, v).rgb();
        }
      }, {
        key: "chRgbLab",
        value: function chRgbLab(L, a, b) {
          return Vis.chroma.lab(L, a, b).rgb();
        }
      }, {
        key: "chRgbLch",
        value: function chRgbLch(L, c, h) {
          return Vis.chroma.lch(l, c, h).rgb();
        }
      }, {
        key: "chRgbHcl",
        value: function chRgbHcl(h, c, l) {
          return Vis.chroma.hsl(h, s, l).rgb();
        }
      }, {
        key: "chRgbCmyk",
        value: function chRgbCmyk(c, m, y, k) {
          return Vis.chroma.hsl(c, m, y, k).rgb();
        }
      }, {
        key: "chRgbGl",
        value: function chRgbGl(R, G, B) {
          return Vis.chroma.gl(R, G, B).rgb();
        }
      }, {
        key: "toRgbRygb",
        value: function toRgbRygb(r, y, g, b) {
          return [Math.max(r, y, 0), Math.max(g, y, 0), Math.max(b, 0)];
        }
      }, {
        key: "toRygbRgb",
        value: function toRygbRgb(r, g, b) {
          return [r, Math.max(r, g), g, b // Needs Work
          ];
        }
      }, {
        key: "toRgbHsvSigmoidal",
        value: function toRgbHsvSigmoidal(H, C, V) {
          var toRygb = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;

          var b, c, d, f, g, h, i, r, v, x, y, z;
          h = toRygb ? Vis.toHueRgb(H) : H;
          d = C * 0.01;
          c = Vis.sigmoidal(d, 2, 0.25);
          v = V * 0.01;
          i = Math.floor(h / 60);
          f = h / 60 - i;
          x = 1 - c;
          y = 1 - f * c;
          z = 1 - (1 - f) * c;

          var _ref = function () {
            switch (i % 6) {
              case 0:
                return [1, z, x, 1];
              case 1:
                return [y, 1, x, 1];
              case 2:
                return [x, 1, z, 1];
              case 3:
                return [x, y, 1, 1];
              case 4:
                return [z, x, 1, 1];
              case 5:
                return [1, x, y, 1];
            }
          }();

          var _ref2 = _slicedToArray(_ref, 3);

          r = _ref2[0];
          g = _ref2[1];
          b = _ref2[2];

          return [r * v, g * v, b * v, 1];
        }
      }, {
        key: "toRgbHsv",
        value: function toRgbHsv(H, C, V) {
          var toRygb = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;

          var b, c, f, g, h, i, r, v, x, y, z;
          h = toRygb ? Vis.toHueRgb(H) : H;
          c = C * 0.01;
          v = V * 0.01;
          i = Math.floor(h / 60);
          f = h / 60 - i;
          x = 1 - c;
          y = 1 - f * c;
          z = 1 - (1 - f) * c;

          var _ref3 = function () {
            switch (i % 6) {
              case 0:
                return [1, z, x, 1];
              case 1:
                return [y, 1, x, 1];
              case 2:
                return [x, 1, z, 1];
              case 3:
                return [x, y, 1, 1];
              case 4:
                return [z, x, 1, 1];
              case 5:
                return [1, x, y, 1];
            }
          }();

          var _ref4 = _slicedToArray(_ref3, 3);

          r = _ref4[0];
          g = _ref4[1];
          b = _ref4[2];

          return [r * v, g * v, b * v, 1];
        }

        // Key algorithm from HCI for converting RGB to HCS  h 360 c 100 s 100

      }, {
        key: "toHcsRgb",
        value: function toHcsRgb(R, G, B) {
          var toRygb = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;

          var H, a, b, c, g, h, r, s, sum;
          sum = R + G + B;
          r = R / sum;
          g = G / sum;
          b = B / sum;
          s = sum / 3;
          c = R === G && G === B ? 0 : 1 - 3 * Math.min(r, g, b); // Center Grayscale
          a = Vis.deg(Math.acos((r - 0.5 * (g + b)) / Math.sqrt((r - g) * (r - g) + (r - b) * (g - b))));
          h = b <= g ? a : 360 - a;
          if (c === 0) {
            h = 0;
          }
          H = toRygb ? Vis.toHueRgb(h) : h;
          return [H, c * 100, s / 2.55];
        }
      }, {
        key: "toRgbCode",
        value: function toRgbCode(code) {
          var hex, rgb, s, str;
          str = Vis.Palettes.hex(code).replace("#", "0x");
          hex = Number.parseInt(str, 16);
          rgb = Vis.hexRgb(hex);
          s = 1 / 256;
          return [rgb.r * s, rgb.g * s, rgb.b * s, 1];
        }
      }, {
        key: "toRgba",
        value: function toRgba(studyPrac) {
          var h, s, v;
          if (studyPrac.hsv != null && studyPrac.hsv.length === 3) {
            var _studyPrac$hsv = _slicedToArray(studyPrac.hsv, 3);

            h = _studyPrac$hsv[0];
            s = _studyPrac$hsv[1];
            v = _studyPrac$hsv[2];

            return Vis.toRgbHsvSigmoidal(h, s, v);
          } else if (studyPrac.fill.length <= 5) {
            return Vis.toRgbCode(studyPrac.fill);
          } else {
            Util.error('Vis.toRgba() unknown fill code', studyPrac.name, studyPrac.fill);
            return '#888888';
          }
        }
      }, {
        key: "toHsvHex",
        value: function toHsvHex(hexStr) {
          var hex, hsv, rgb, str;
          str = hexStr.replace("#", "0x");
          hex = Number.parseInt(str, 16);
          rgb = Vis.hexRgb(hex);
          hsv = Vis.toHcsRgb(rgb.r, rgb.g, rgb.b);
          return hsv;
        }
      }, {
        key: "toHexRgb",
        value: function toHexRgb(rgb) {
          return rgb[0] * 4026 + rgb[1] * 256 + rgb[2];
        }
      }, {
        key: "toCssHex",
        value: function toCssHex(hex) {
          return "#" + hex.toString(16) // For orthogonality
          ;
        }
      }, {
        key: "toCssHsv1",
        value: function toCssHsv1(hsv) {
          var css, hex, rgb;
          rgb = Vis.toRgbHsv(hsv[0], hsv[1], hsv[2]);
          hex = Vis.toHexRgbSigmoidal(rgb);
          css = "#" + hex.toString();
          return css;
        }
      }, {
        key: "toCssHsv2",
        value: function toCssHsv2(hsv) {
          var css, rgb;
          rgb = Vis.toRgbHsvSigmoidal(hsv[0], hsv[1], hsv[2]);
          css = Vis.chroma.gl(rgb[0], rgb[1], rgb[2]).hex();
          return css;
        }
      }, {
        key: "toHsvCode",
        value: function toHsvCode(code) {
          var hsv, i, j, rgb;
          rgb = Vis.toRgbCode(code);
          hsv = Vis.toHcsRgb(rgb[0], rgb[1], rgb[2], true);
          for (i = j = 0; j < 3; i = ++j) {
            hsv[i] = Math.round(hsv[i]);
          }
          return hsv;
        }
      }, {
        key: "chRgbHsvStr",
        value: function chRgbHsvStr(hsv) {
          var h, i, j, rgb;
          h = Vis.toHueRgb(hsv[0]);
          rgb = Vis.chRgbHsv(h, hsv[1] * 0.01, hsv[2] * 0.01);
          for (i = j = 0; j < 3; i = ++j) {
            rgb[i] = Math.round(rgb[i]);
          }
          return "rgba(" + rgb[0] + "," + rgb[1] + "," + rgb[2] + ",1)";
        }
      }, {
        key: "toRgbHsvStr",
        value: function toRgbHsvStr(hsv) {
          var a, b, g, i, j, r, rgba, str;
          rgba = Vis.toRgbHsvSigmoidal(hsv[0], hsv[1], hsv[2] * 255, true);
          for (i = j = 0; j < 3; i = ++j) {
            rgba[i] = Math.round(rgba[i]);
          }
          var _rgba2 = rgba;

          var _rgba3 = _slicedToArray(_rgba2, 4);

          r = _rgba3[0];
          g = _rgba3[1];
          b = _rgba3[2];
          a = _rgba3[3];

          str = "rgba(" + r + "," + g + "," + b + "," + a + ")";
          //Util.log( "Vis.toRgbHsvStr()", {h:hsv[0],s:hsv[1],v:hsv[2]}, str )
          return str;
        }
      }, {
        key: "sigmoidal",
        value: function sigmoidal(x, k) {
          var x0 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0.5;
          var L = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1;

          return L / (1 + Math.exp(-k * (x - x0)));
        }
      }, {
        key: "toRgbHcs",
        value: function toRgbHcs(H, C, S) {
          var toRygb = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;

          var b, c, g, h, max, r, s, v, x, y, z;
          h = toRygb ? Vis.toHueRgb(H) : H;
          c = C * 0.01;
          s = S * 0.01;
          x = 1 - c;
          y = function y(a) {
            return 1 + c * Vis.cos(h - a) / Vis.cos(a + 60 - h);
          };
          z = function z(a) {
            return 3 - x - y(a);
          };
          r = 0;
          g = 0;
          b = 0;

          if (0 <= h && h < 120) {
            var _ref5 = [y(0), z(0), x];
            r = _ref5[0];
            g = _ref5[1];
            b = _ref5[2];
          }
          if (120 <= h && h < 240) {
            var _ref6 = [x, y(120), z(120)];
            r = _ref6[0];
            g = _ref6[1];
            b = _ref6[2];
          }
          if (240 <= h && h < 360) {
            var _ref7 = [z(240), x, y(240)];
            r = _ref7[0];
            g = _ref7[1];
            b = _ref7[2];
          }
          max = Math.max(r, g, b) * s;
          v = max > 255 ? s * 255 / max : s;
          return [r * v, g * v, b * v, 1];
        }
      }, {
        key: "toRgbSphere",
        value: function toRgbSphere(hue, phi, rad) {
          return Vis.toRgbHsv(Vis.rot(hue, 90), 100 * Vis.sin(phi), 100 * rad);
        }
      }, {
        key: "toHclRygb",
        value: function toHclRygb(r, y, g, b) {
          var C, H, L;
          L = (r + y + g + b) / 4;
          C = (Math.abs(r - y) + Math.abs(y - g) + Math.abs(g - b) + Math.abs(b - r)) / 4;
          H = Vis.angle(r - g, y - b, 0);
          return [H, C, L];
        }
      }, {
        key: "sScale",
        value: function sScale(hue, c, s) {
          var ch, m120, m60, s60, ss;
          ss = 1.0;
          m60 = hue % 60;
          m120 = hue % 120;
          s60 = m60 / 60;
          ch = c / 100;
          ss = m120 < 60 ? 3.0 - 1.5 * s60 : 1.5 + 1.5 * s60;
          return s * (1 - ch) + s * ch * ss;
        }
      }, {
        key: "sScaleCf",
        value: function sScaleCf(hue, c, s) {
          var cf, cosd, cosu, m120, m60, ss;
          ss = sScale(hue, c, s);
          m60 = hue % 60;
          m120 = hue % 120;
          cosu = (1 - Vis.cos(m60)) * 100.00;
          cosd = (1 - Vis.cos(60 - m60)) * 100.00;
          cf = m120 < 60 ? cosu : cosd;
          return ss - cf;
        }

        // ransform RGB to RYGB hue

      }, {
        key: "toHueRygb",
        value: function toHueRygb(hue) {
          var hRygb;
          hRygb = 0;
          if (0 <= hue && hue < 120) {
            hRygb = hue * 180 / 120;
          } else if (120 <= hue && hue < 240) {
            hRygb = 180 + (hue - 120) * 90 / 120;
          } else if (240 <= hue && hue < 360) {
            hRygb = 270 + (hue - 240) * 90 / 120;
          }
          return hRygb;
        }

        // ransform RyGB to RGB hueT

      }, {
        key: "toHueRgb",
        value: function toHueRgb(hue) {
          var hRgb;
          hRgb = 0;
          if (0 <= hue && hue < 90) {
            hRgb = hue * 60 / 90;
          } else if (90 <= hue && hue < 180) {
            hRgb = 60 + (hue - 90) * 60 / 90;
          } else if (180 <= hue && hue < 270) {
            hRgb = 120 + (hue - 180) * 120 / 90;
          } else if (270 <= hue && hue < 360) {
            hRgb = 240 + (hue - 270) * 120 / 90;
          }
          return hRgb;
        }
      }, {
        key: "pad2",
        value: function pad2(n) {
          var s;
          s = n.toString();
          if (0 <= n && n <= 9) {
            s = '&nbsp;' + s;
          }
          return s;
        }
      }, {
        key: "pad3",
        value: function pad3(n) {
          var s;
          s = n.toString();
          if (0 <= n && n <= 9) {
            s = '&nbsp;&nbsp;' + s;
          }
          if (10 <= n && n <= 99) {
            s = '&nbsp;' + s;
          }
          //Util.dbg( 'pad', { s:'|'+s+'|', n:n,  } )
          return s;
        }
      }, {
        key: "dec",
        value: function dec(f) {
          return Math.round(f * 100) / 100;
        }
      }, {
        key: "quotes",
        value: function quotes(str) {
          return '"' + str + '"';
        }
      }, {
        key: "within",
        value: function within(beg, deg, end) {
          return beg <= deg && deg <= end; // Closed interval with <=
        }
      }, {
        key: "isZero",
        value: function isZero(v) {
          return -0.01 < v && v < 0.01;
        }
      }, {
        key: "floor",
        value: function floor(x, dx) {
          var dr;
          dr = Math.round(dx);
          return Math.floor(x / dr) * dr;
        }
      }, {
        key: "ceil",
        value: function ceil(x, dx) {
          var dr;
          dr = Math.round(dx);
          return Math.ceil(x / dr) * dr;
        }
      }, {
        key: "to",
        value: function to(a, a1, a2, b1, b2) {
          return (a - a1) / (a2 - a1) * (b2 - b1) + b1; // Linear transforms that calculates b from a
        }

        // Need to fully determine if these isZero checks are really necessary. Also need to account for SVG angles

      }, {
        key: "angle",
        value: function angle(x, y) {
          var ang;
          if (!this.isZero(x) && !this.isZero(y)) {
            ang = Vis.deg(Math.atan2(y, x));
          }
          if (this.isZero(x) && this.isZero(y)) {
            ang = 0;
          }
          if (x > 0 && this.isZero(y)) {
            ang = 0;
          }
          if (this.isZero(x) && y > 0) {
            ang = 90;
          }
          if (x < 0 && this.isZero(y)) {
            ang = 180;
          }
          if (this.isZero(x) && y < 0) {
            ang = 270;
          }
          ang = Vis.deg(Math.atan2(y, x));
          return ang = ang < 0 ? 360 + ang : ang;
        }
      }, {
        key: "angleSvg",
        value: function angleSvg(x, y) {
          return Vis.angle(x, -y);
        }
      }, {
        key: "minRgb",
        value: function minRgb(rgb) {
          return Math.min(rgb.r, rgb.g, rgb.b);
        }
      }, {
        key: "maxRgb",
        value: function maxRgb(rgb) {
          return Math.max(rgb.r, rgb.g, rgb.b);
        }
      }, {
        key: "sumRgb",
        value: function sumRgb(rgb) {
          return rgb.r + rgb.g + rgb.b;
        }
      }, {
        key: "hexCss",
        value: function hexCss(hex) {
          return "#" + hex.toString(16) // For orthogonality
          ;
        }
      }, {
        key: "rgbCss",
        value: function rgbCss(rgb) {
          return "rgb(" + rgb.r + "," + rgb.g + "," + rgb.b + ")";
        }
      }, {
        key: "hslCss",
        value: function hslCss(hsl) {
          return "hsl(" + hsl.h + "," + hsl.s * 100 + "%," + hsl.l * 100 + "%)";
        }
      }, {
        key: "hsiCss",
        value: function hsiCss(hsi) {
          return Vis.hslCss(Vis.rgbToHsl(Vis.hsiToRgb(hsi)));
        }
      }, {
        key: "hsvCss",
        value: function hsvCss(hsv) {
          return Vis.hslCss(Vis.rgbToHsl(Vis.hsvToRgb(hsv)));
        }
      }, {
        key: "roundRgb",
        value: function roundRgb(rgb) {
          var f = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1.0;

          return {
            r: Math.round(rgb.r * f),
            g: Math.round(rgb.g * f),
            b: Math.round(rgb.b * f)
          };
        }
      }, {
        key: "roundHsl",
        value: function roundHsl(hsl) {
          return {
            h: Math.round(hsl.h),
            s: Vis.dec(hsl.s),
            l: Vis.dec(hsl.l)
          };
        }
      }, {
        key: "roundHsi",
        value: function roundHsi(hsi) {
          return {
            h: Math.round(hsi.h),
            s: Vis.dec(hsi.s),
            i: Math.round(hsi.i)
          };
        }
      }, {
        key: "roundHsv",
        value: function roundHsv(hsv) {
          return {
            h: Math.round(hsv.h),
            s: Vis.dec(hsv.s),
            v: Vis.dec(hsv.v)
          };
        }
      }, {
        key: "fixedDec",
        value: function fixedDec(rgb) {
          return {
            r: Vis.dec(rgb.r),
            g: Vis.dec(rgb.g),
            b: Vis.dec(rgb.b)
          };
        }
      }, {
        key: "hexRgb",
        value: function hexRgb(hex) {
          return Vis.roundRgb({
            r: (hex & 0xFF0000) >> 16,
            g: (hex & 0x00FF00) >> 8,
            b: hex & 0x0000FF
          });
        }
      }, {
        key: "rgbHex",
        value: function rgbHex(rgb) {
          return rgb.r * 4096 + rgb.g * 256 + rgb.b;
        }
      }, {
        key: "cssRgb",
        value: function cssRgb(str) {
          var hex, hsl, rgb, toks;
          rgb = {
            r: 0,
            g: 0,
            b: 0
          };
          if (str[0] === '#') {
            hex = parseInt(str.substr(1), 16);
            rgb = Vis.hexRgb(hex);
          } else if (str.slice(0, 3) === 'rgb') {
            toks = str.split(/[\s,\(\)]+/);
            rgb = Vis.roundRgb({
              r: parseInt(toks[1]),
              g: parseInt(toks[2]),
              b: parseInt(toks[3])
            });
          } else if (str.slice(0, 3) === 'hsl') {
            toks = str.split(/[\s,\(\)]+/);
            hsl = {
              h: parseInt(toks[1]),
              s: parseInt(toks[2]),
              l: parseInt(toks[3])
            };
            rgb = Vis.hslToRgb(hsl);
          } else {
            Util.error('Vis.cssRgb() unknown CSS color', str);
          }
          return rgb;
        }

        // Util.dbg( 'Vis.cssRgb', toks.length, { r:toks[1], g:toks[2], b:toks[3] } )

      }, {
        key: "rgbToHsi",
        value: function rgbToHsi(rgb) {
          var a, b, g, h, i, r, s, sum;
          sum = Vis.sumRgb(rgb);
          r = rgb.r / sum;
          g = rgb.g / sum;
          b = rgb.b / sum;
          i = sum / 3;
          s = 1 - 3 * Math.min(r, g, b);
          a = Vis.deg(Math.acos((r - 0.5 * (g + b)) / Math.sqrt((r - g) * (r - g) + (r - b) * (g - b))));
          h = b <= g ? a : 360 - a;
          return Vis.roundHsi({
            h: h,
            s: s,
            i: i
          });
        }
      }, {
        key: "hsiToRgb",
        value: function hsiToRgb(hsi) {
          var fac, h, i, max, rgb, s, x, y, z;
          h = hsi.h;
          s = hsi.s;
          i = hsi.i;
          x = 1 - s;
          y = function y(a) {
            return 1 + s * Vis.cos(h - a) / Vis.cos(a + 60 - h);
          };
          z = function z(a) {
            return 3 - x - y(a);
          };
          rgb = {
            r: 0,
            g: 0,
            b: 0
          };
          if (0 <= h && h < 120) {
            rgb = {
              r: y(0),
              g: z(0),
              b: x
            };
          }
          if (120 <= h && h < 240) {
            rgb = {
              r: x,
              g: y(120),
              b: z(120)
            };
          }
          if (240 <= h && h < 360) {
            rgb = {
              r: z(240),
              g: x,
              b: y(240)
            };
          }
          max = Vis.maxRgb(rgb) * i;
          fac = max > 255 ? i * 255 / max : i;
          //Util.dbg('Vis.hsiToRgb', hsi, Vis.roundRgb(rgb,fac), Vis.fixedDec(rgb), Vis.dec(max) )
          return Vis.roundRgb(rgb, fac);
        }
      }, {
        key: "hsvToRgb",
        value: function hsvToRgb(hsv) {
          var f, i, p, q, rgb, t, v;
          i = Math.floor(hsv.h / 60);
          f = hsv.h / 60 - i;
          p = hsv.v * (1 - hsv.s);
          q = hsv.v * (1 - f * hsv.s);
          t = hsv.v * (1 - (1 - f) * hsv.s);
          v = hsv.v;
          rgb = function () {
            switch (i % 6) {
              case 0:
                return {
                  r: v,
                  g: t,
                  b: p
                };
              case 1:
                return {
                  r: q,
                  g: v,
                  b: p
                };
              case 2:
                return {
                  r: p,
                  g: v,
                  b: t
                };
              case 3:
                return {
                  r: p,
                  g: q,
                  b: v
                };
              case 4:
                return {
                  r: t,
                  g: p,
                  b: v
                };
              case 5:
                return {
                  r: v,
                  g: p,
                  b: q
                };
              default:
                Util.error('Vis.hsvToRgb()');
                return {
                  r: v,
                  g: t,
                  b: p // Should never happend
                };
            }
          }();
          return Vis.roundRgb(rgb, 255);
        }
      }, {
        key: "rgbToHsv",
        value: function rgbToHsv(rgb) {
          var d, h, max, min, s, v;
          rgb = Vis.rgbRound(rgb, 1 / 255);
          max = Vis.maxRgb(rgb);
          min = Vis.maxRgb(rgb);
          v = max;
          d = max - min;
          s = max === 0 ? 0 : d / max;
          h = 0; // achromatic
          if (max !== min) {
            h = function () {
              switch (max) {
                case r:
                  return (rgb.g - rgb.b) / d + (g < b ? 6 : 0);
                case g:
                  return (rgb.b - rgb.r) / d + 2;
                case b:
                  return (rgb.r - rgb.g) / d + 4;
                default:
                  return Util.error('Vis.rgbToHsv');
              }
            }();
          }
          return {
            h: Math.round(h * 60),
            s: Vis.dec(s),
            v: Vis.dec(v)
          };
        }
      }, {
        key: "hslToRgb",
        value: function hslToRgb(hsl) {
          var b, g, h, l, p, q, r, s;
          h = hsl.h;
          s = hsl.s;
          l = hsl.l;
          r = 1;
          g = 1;
          b = 1;
          if (s !== 0) {
            q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            p = 2 * l - q;
            r = Vis.hue2rgb(p, q, h + 1 / 3);
            g = Vis.hue2rgb(p, q, h);
            b = Vis.hue2rgb(p, q, h - 1 / 3);
          }
          return {
            r: Math.round(r * 255),
            g: Math.round(g * 255),
            b: Math.round(b * 255)
          };
        }
      }, {
        key: "hue2rgb",
        value: function hue2rgb(p, q, t) {
          if (t < 0) {
            t += 1;
          }
          if (t > 1) {
            t -= 1;
          }
          if (t < 1 / 6) {
            return p + (q - p) * 6 * t;
          }
          if (t < 1 / 2) {
            return q;
          }
          if (t < 2 / 3) {
            return p + (q - p) * (2 / 3 - t) * 6;
          }
          return p;
        }
      }, {
        key: "rgbsToHsl",
        value: function rgbsToHsl(red, green, blue) {
          return this.rgbToHsl({
            r: red,
            g: green,
            b: blue
          });
        }
      }, {
        key: "rgbToHsl",
        value: function rgbToHsl(rgb) {
          var b, d, g, h, l, max, min, r, s;
          r = rgb.r / 255;
          g = rgb.g / 255;
          b = rgb.b / 255;
          max = Math.max(r, g, b);
          min = Math.min(r, g, b);
          h = 0; // achromatic
          l = (max + min) / 2;
          s = 0;
          if (max !== min) {
            d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            h = function () {
              switch (max) {
                case r:
                  return (g - b) / d + (g < b ? 6 : 0);
                case g:
                  return (b - r) / d + 2;
                case b:
                  return (r - g) / d + 4;
                default:
                  Util.error('Vis.@rgbToHsl()');
                  return 0;
              }
            }();
          }
          return {
            h: Math.round(h * 60),
            s: Vis.dec(s),
            l: Vis.dec(l)
          };
        }

        //for key, uc of Prac.FontAwesomeUnicodes
        //Util.log( 'Awesome', key, "#{uc}" )

      }, {
        key: "unicode",
        value: function unicode(icon) {
          var uc;
          uc = Vis.FontAwesomeUnicodes[icon];
          if (uc == null) {
            //uc = Vis.uniawe( icon )
            //if not uc?
            Util.error('Vis.unicode() missing icon in Vis.FontAwesomeUnicodes for', icon);
            uc = "\uF111"; // Circle
          }
          return uc;
        }
      }, {
        key: "unichar",
        value: function unichar(icon) {
          var uc, un, us;
          uc = Vis.FontAwesomeUnicodes[icon];
          uc = uc == null ? "\uF111" : uc;
          un = Number.parseInt('0xf0ad', 16);
          us = String.fromCharCode(un);
          Util.log('Vis.unichar', {
            icon: icon,
            uc: uc,
            un: un,
            us: us
          });
          return "\uF000";
        }
      }, {
        key: "uniawe",
        value: function uniawe(icon) {
          var temp, uni;
          temp = document.createElement("i");
          temp.className = icon;
          document.body.appendChild(temp);
          uni = window.getComputedStyle(document.querySelector('.' + icon), ':before').getPropertyValue('content');
          Util.log('uniawe', icon, uni);
          temp.remove();
          return uni;
        }
      }]);

      return Vis;
    }();

    ;

    module.exports = Vis;

    Vis.Palettes = require('js/d3d/Palettes');

    Vis.chroma = require('chroma-js');

    Vis.FontAwesomeUnicodes = (_Vis$FontAwesomeUnico = {
      "fa-calendar-o": "\uF133",
      "fa-book": "\uF02D",
      "fa-steam": "\uF1B6",
      "fa-circle": "\uF111",
      "fa-signal": "\uF012",
      "fa-external-link-square": "\uF14C",
      "fa-group": "\uF0C0",
      "fa-empire": "\uF1D1",
      "fa-diamond": "\uF219",
      "fa-spinner": "\uF110",
      "fa-wrench": "\uF0AD",
      "fa-bar-chart-o": "\uF080",
      "fa-refresh": "\uF021",
      "fa-medkit": "\uF0FA",
      "fa-compass": "\uF14E",
      "fa-flask": "\uF0C3",
      "fa-connectdevelop": "\uF20E",
      "fa-joomla": "\uF1AA",
      "fa-bar-chart": "\uF080",
      "fa-star-o": "\uF006",
      "fa-area-chart": "\uF1FE",
      "fa-cloud": "\uF0C2",
      "fa-code-fork": "\uF126",
      "fa-question-circle": "\uF059",
      "fa-tripadvisor": "\uF262",
      "fa-magic": "\uF0D0",
      "fa-object-group": "\uF247",
      "fa-language": "\uF1AB",
      "fa-graduation-cap": "\uF19D",
      "fa-user-plus": "\uF234",
      "fa-github-square": "\uF092",
      "fa-paint-brush": "\uF1FC",
      "fa-lightbulb-o": "\uF0EB",
      "fa-address-card": "\uF2BB",
      "fa-history": "\uF1DA",
      "fa-eye": "\uF06E",
      "fa-fire": "\uF06D",
      "fa-codepen": "\uF0C1",
      "fa-link": "\uF0C1",
      "fa-tasks": "\uF0AE",
      "fa-child": "\uF1AE",
      "fa-briefcase": "\uF0B1",
      "fa-dropbox": "\uF16B",
      "fa-user": "\uF007",
      "fa-heart": "\uF004",
      "fa-truck": "\uF0D1",
      "fa-star": "\uF005",
      "fa-sitemap": "\uF0E8",
      "fa-cube": "\uF0EB",
      "fa-desktop": "\uF108",
      "fa-bars": "\uF0C9",
      "fa-database": "\uF1C0",
      "fa-binoculars": "\uF164",
      "fa-thumbs-up": "\uF0A2",
      "fa-bell": "\uF0F1",
      "fa-stethoscope": "\uF0F1",
      "fa-random": "\uF074",
      "fa-cogs": "\uF085",
      "fa-life-ring": "\uF1CD",
      "fa-globe": "\uF0AC",
      "fa-lock": "\uF023",
      "fa-cubes": "\uF1B3",
      "fa-money": "\uF0D6",
      "fa-anchor": "\uF13D",
      "fa-legal": "\uF0E3",
      "fa-university": "\uF19C",
      "fa-shield": "\uF132",
      "fa-align-left": "\uF036",
      "fa-arrow-circle-right": "\uF0A9",
      "fa-retweet": "\uF079",
      "fa-check-square": "\uF14A",
      "fa-modx": "\uF285",
      "fa-ioxhost": "\uF208",
      "fa-calculator": "\uF1EC",
      "fa-wordpress": "\uF19A",
      "fa-filter": "\uF0B0",
      "fa-html5": "\uF13B",
      "fa-search": "\uF002",
      "fa-leanpub": "\uF212",
      "fa-sliders": "\uF1DE"
    }, _defineProperty(_Vis$FontAwesomeUnico, "fa-database", "\uF1C0"), _defineProperty(_Vis$FontAwesomeUnico, "fa-table", "\uF0CE"), _defineProperty(_Vis$FontAwesomeUnico, "fa-user-md", "\uF0F0"), _defineProperty(_Vis$FontAwesomeUnico, "fa-line-chart", "\uF201"), _defineProperty(_Vis$FontAwesomeUnico, "fa-certificate", "\uF0A3"), _defineProperty(_Vis$FontAwesomeUnico, "fa-clone", "\uF24D"), _defineProperty(_Vis$FontAwesomeUnico, "fa-thumbs-down", "\uF165"), _defineProperty(_Vis$FontAwesomeUnico, "fa-hand-peace-o", "\uF25B"), _defineProperty(_Vis$FontAwesomeUnico, "fa-users", "\uF0C0"), _defineProperty(_Vis$FontAwesomeUnico, "fa-balance-scale", "\uF24E"), _defineProperty(_Vis$FontAwesomeUnico, "fa-newspaper-o", "\uF1EA"), _defineProperty(_Vis$FontAwesomeUnico, "fa-wechat", "\uF1D7 "), _defineProperty(_Vis$FontAwesomeUnico, "fa-leaf", "\uF06C"), _defineProperty(_Vis$FontAwesomeUnico, "fa-dropbox", "\uF16B"), _defineProperty(_Vis$FontAwesomeUnico, "fa-external-link-square", "\uF14C"), _defineProperty(_Vis$FontAwesomeUnico, "fa-university", "\uF19C"), _defineProperty(_Vis$FontAwesomeUnico, "fa-life-ring", "\uF1CD"), _defineProperty(_Vis$FontAwesomeUnico, "fa-cubes", "\uF1B3"), _defineProperty(_Vis$FontAwesomeUnico, "fa-anchor", "\uF13D"), _defineProperty(_Vis$FontAwesomeUnico, "fa-compass", "\uF066"), _defineProperty(_Vis$FontAwesomeUnico, "fa-question", "\uF128"), _defineProperty(_Vis$FontAwesomeUnico, "fa-asl-interpreting", "\uF2A3"), _defineProperty(_Vis$FontAwesomeUnico, "fa-road", "\uF018"), _defineProperty(_Vis$FontAwesomeUnico, "fa-pied-piper-alt", "\uF1A8"), _defineProperty(_Vis$FontAwesomeUnico, "fa-gift", "\uF06B"), _defineProperty(_Vis$FontAwesomeUnico, "fa-universal-access", "\uF29A"), _defineProperty(_Vis$FontAwesomeUnico, "fa-cloud-download", "\uF0ED"), _defineProperty(_Vis$FontAwesomeUnico, "fa-blind", "\uF29D"), _defineProperty(_Vis$FontAwesomeUnico, "fa-sun-o", "\uF185"), _defineProperty(_Vis$FontAwesomeUnico, "fa-gears", "\uF085"), _defineProperty(_Vis$FontAwesomeUnico, "fa-gamepad", "\uF11B"), _defineProperty(_Vis$FontAwesomeUnico, "fa-slideshare", "\uF1E7"), _defineProperty(_Vis$FontAwesomeUnico, "fa-envelope-square", "\uF199"), _defineProperty(_Vis$FontAwesomeUnico, "fa-recycle", "\uF1B8"), _defineProperty(_Vis$FontAwesomeUnico, "fa-list-alt", "\uF022"), _defineProperty(_Vis$FontAwesomeUnico, "fa-wheelchair-alt", "\uF29B"), _defineProperty(_Vis$FontAwesomeUnico, "fa-trophy", "\uF091"), _defineProperty(_Vis$FontAwesomeUnico, "fa-headphones", "\uF025"), _defineProperty(_Vis$FontAwesomeUnico, "fa-codiepie", "\uF284"), _defineProperty(_Vis$FontAwesomeUnico, "fa-building-o", "\uF0F7"), _defineProperty(_Vis$FontAwesomeUnico, "fa-plus-circle", "\uF055"), _defineProperty(_Vis$FontAwesomeUnico, "fa-server", "\uF233"), _defineProperty(_Vis$FontAwesomeUnico, "fa-square-o", "\uF096"), _defineProperty(_Vis$FontAwesomeUnico, "fa-share-alt", "\uF1E0"), _defineProperty(_Vis$FontAwesomeUnico, "fa-handshake-o", "\uF2B5"), _defineProperty(_Vis$FontAwesomeUnico, "fa-snowflake-o", "\uF2DC"), _defineProperty(_Vis$FontAwesomeUnico, "fa-shower", "\uF2CC"), _Vis$FontAwesomeUnico);

    return Vis;
  }.call(this);

  /*
  var setCursor = function (icon) {
  var tempElement = document.createElement("i");
  tempElement.className = icon;
  document.body.appendChild(tempElement);
  var character = window.getComputedStyle(
    document.querySelector('.' + icon), ':before'
  ).getPropertyValue('content');
  tempElement.remove();
  */
}).call(undefined);
