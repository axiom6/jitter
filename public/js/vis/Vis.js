import Util     from '../util/Util.js';
import FaLookup from '../vis/FaLookup.js';
var Vis;

Vis = class Vis {
  static translate(x0, y0) {
    Util.checkTypes('number', {
      x0: x0,
      y0: y0
    });
    return ` translate( ${x0}, ${y0} )`;
  }

  static scale(sx, sy) {
    Util.checkTypes('number', {
      sx: sx,
      sy: sy
    });
    return ` scale( ${sx}, ${sx} )`;
  }

  static rotate(a, x, y) {
    Util.checkTypes('number', {
      a: a,
      x: x,
      y: y
    });
    return ` rotate(${a} ${x} ${y} )`;
  }

  static rad(deg) {
    return deg * Math.PI / 180;
  }

  static deg(rad) {
    return rad * 180 / Math.PI;
  }

  static sin(deg) {
    return Math.sin(Vis.rad(deg));
  }

  static cos(deg) {
    return Math.cos(Vis.rad(deg));
  }

  static rot(deg, ang) {
    var a;
    a = deg + ang;
    if (a < 0) {
      a = a + 360;
    }
    return a;
  }

  static toRadian(h, hueIsRygb = false) {
    var hue, radian;
    hue = hueIsRygb ? Vis.toHueRygb(h) : h;
    radian = 2 * Math.PI * (90 - hue) / 360; // Correction for MathBox polar coordinate system
    if (radian < 0) {
      radian = 2 * Math.PI + radian;
    }
    return radian;
  }

  static svgDeg(deg) {
    return 360 - deg;
  }

  static svgRad(rad) {
    return 2 * Math.PI - rad;
  }

  static radSvg(deg) {
    return Vis.rad(360 - deg);
  }

  static degSvg(rad) {
    return Vis.deg(2 * Math.PI - rad);
  }

  static sinSvg(deg) {
    return Math.sin(Vis.radSvg(deg));
  }

  static cosSvg(deg) {
    return Math.cos(Vis.radSvg(deg));
  }

  static hexCss(hex) {
    return `#${hex.toString(16) // For orthogonality
}`;
  }

  static rgbCss(rgb) {
    return `rgb(${rgb.r},${rgb.g},${rgb.b})`;
  }

  static hslCss(hsl) {
    return `hsl(${hsl.h},${hsl.s * 100}%,${hsl.l * 100}%)`;
  }

  static cssHex(str) {
    return parseInt(str.substr(1), 16);
  }

  static rndRgb(rgb) {
    return {
      r: Math.round(rgb.r),
      g: Math.round(rgb.g),
      b: Math.round(rgb.b)
    };
  }

  static hexRgb(hex) {
    return Vis.rndRgb({
      r: (hex & 0xFF0000) >> 16,
      g: (hex & 0x00FF00) >> 8,
      b: hex & 0x0000FF
    });
  }

  static rgbHex(rgb) {
    return rgb.r * 4096 + rgb.g * 256 + rgb.b;
  }

  static interpolateHexRgb(hex1, r1, hex2, r2) {
    return Vis.interpolateRgb(Vis.hexRgb(hex1), r1, Vis.hexRgb(hex2), r2);
  }

  static interpolateRgb(rgb1, r1, rgb2, r2) {
    return {
      r: rgb1.r * r1 + rgb2.r * r2,
      g: rgb1.g * r1 + rgb2.g * r2,
      b: rgb1.b * r1 + rgb2.b * r2
    };
  }

  static toRgbHsvStr(hsv) {
    var a, b, g, i, j, r, rgba, str;
    rgba = Vis.toRgbHsvSigmoidal(hsv[0], hsv[1], hsv[2] * 255, true);
    for (i = j = 0; j < 3; i = ++j) {
      rgba[i] = Math.round(rgba[i]);
    }
    [r, g, b, a] = rgba;
    str = `rgba(${r},${g},${b},${a})`;
    //console.log( "Vis.toRgbHsvStr()", {h:hsv[0],s:hsv[1],v:hsv[2]}, str )
    return str;
  }

  static toRgbHsvSigmoidal(H, C, V, toRygb = true) {
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
    [r, g, b] = (function() {
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
    })();
    return [r * v, g * v, b * v, 1];
  }

  static sigmoidal(x, k, x0 = 0.5, L = 1) {
    return L / (1 + Math.exp(-k * (x - x0)));
  }

  // ransform RyGB to RGB hueT
  static toHueRgb(hue) {
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

  static unicode(icon) {
    var uc;
    uc = FaLookup.icons[icon];
    if (uc == null) {
      console.error('Vis.unicode() missing icon in Vis.FontAwesomeUnicodes for', icon);
      uc = "\uf111"; // Circle
    }
    return uc;
  }

  static uniawe(icon) {
    var temp, uni;
    temp = document.createElement("i");
    temp.className = icon;
    document.body.appendChild(temp);
    uni = window.getComputedStyle(document.querySelector('.' + icon), ':before').getPropertyValue('content');
    console.log('uniawe', icon, uni);
    temp.remove();
    return uni;
  }

};

export default Vis;
