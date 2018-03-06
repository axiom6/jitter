
class Vis
  
  @rad:( deg ) -> deg * Math.PI / 180
  @deg:( rad ) -> rad * 180 / Math.PI
  @sin:( deg ) -> Math.sin(Vis.rad(deg))
  @cos:( deg ) -> Math.cos(Vis.rad(deg))

  @rot:( deg, ang ) ->
    a = deg+ang
    a = a + 360 if a < 0
    a

  @toRadian:( h, hueIsRygb=false ) ->
    hue    = if hueIsRygb then Vis.toHueRygb(h) else h
    radian = 2*π*(90-hue)/360  # Correction for MathBox polar coordinate system
    radian = 2*π + radian if radian < 0
    radian

  @svgDeg:( deg ) -> 360-deg
  @svgRad:( rad ) -> 2*Math.PI-rad

  @radSvg:( deg ) -> Vis.rad(360-deg)
  @degSvg:( rad ) -> Vis.deg(2*Math.PI-rad)
  @sinSvg:( deg ) -> Math.sin(Vis.radSvg(deg))
  @cosSvg:( deg ) -> Math.cos(Vis.radSvg(deg))