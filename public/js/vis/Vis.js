var Vis;

Vis = class Vis {
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

};
