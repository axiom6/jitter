
`import Util     from '../util/Util.js'`
`import FaLookup from '../vis/FaLookup.js'`

class Vis

  @translate:( x0, y0 ) ->
    Util.checkTypes('number',{x0:x0,y0:y0})
    " translate( #{x0}, #{y0} )"

  @scale:( sx, sy )  ->
    Util.checkTypes('number',{sx:sx,sy:sy})
    " scale( #{sx}, #{sx} )"

  @rotate:( a, x, y ) ->
    Util.checkTypes('number',{a:a,x:x,y:y})
    " rotate(#{a} #{x} #{y} )"
  
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
    radian = 2*Math.PI*(90-hue)/360  # Correction for MathBox polar coordinate system
    radian = 2*Math.PI + radian if radian < 0
    radian

  @svgDeg:( deg ) -> 360-deg
  @svgRad:( rad ) -> 2*Math.PI-rad

  @radSvg:( deg ) -> Vis.rad(360-deg)
  @degSvg:( rad ) -> Vis.deg(2*Math.PI-rad)
  @sinSvg:( deg ) -> Math.sin(Vis.radSvg(deg))
  @cosSvg:( deg ) -> Math.cos(Vis.radSvg(deg))

  @hexCss:( hex ) -> """##{hex.toString(16)}""" # For orthogonality
  @rgbCss:( rgb ) -> """rgb(#{rgb.r},#{rgb.g},#{rgb.b})"""
  @hslCss:( hsl ) -> """hsl(#{hsl.h},#{hsl.s*100}%,#{hsl.l*100}%)"""

  @cssHex:( str ) -> parseInt( str.substr(1), 16 )

  @rndRgb:( rgb ) -> { r:Math.round(rgb.r), g:Math.round(rgb.g), b:Math.round(rgb.b) }
  @hexRgb:( hex ) -> Vis.rndRgb( { r:(hex & 0xFF0000) >> 16, g:(hex & 0x00FF00) >> 8, b:hex & 0x0000FF } )
  @rgbHex:( rgb ) -> rgb.r * 4096 + rgb.g * 256 + rgb.b

  @interpolateHexRgb:( hex1, r1, hex2, r2 ) ->
    Vis.interpolateRgb( Vis.hexRgb(hex1), r1, Vis.hexRgb(hex2), r2 )

  @interpolateRgb:( rgb1, r1, rgb2, r2 ) ->
    { r:rgb1.r * r1 + rgb2.r * r2, g:rgb1.g * r1 + rgb2.g * r2, b:rgb1.b * r1 + rgb2.b * r2 }

  @toRgbHsvStr:( hsv ) ->
    rgba      = Vis.toRgbHsvSigmoidal( hsv[0], hsv[1], hsv[2]*255, true )
    rgba[i]   = Math.round(rgba[i]) for i in [0...3]
    [r,g,b,a] = rgba
    str = """rgba(#{r},#{g},#{b},#{a})"""
    #console.log( "Vis.toRgbHsvStr()", {h:hsv[0],s:hsv[1],v:hsv[2]}, str )
    str

  @toRgbHsvSigmoidal:( H, C, V, toRygb=true ) ->
    h = if toRygb then Vis.toHueRgb(H) else H
    d = C * 0.01
    c = Vis.sigmoidal( d, 2, 0.25 )
    v = V * 0.01
    i = Math.floor( h / 60 )
    f = h / 60 - i
    x = 1 - c
    y = 1 - f * c
    z = 1 - (1 - f) * c
    [r,g,b] = switch i % 6
      when 0 then [ 1, z, x, 1 ]
      when 1 then [ y, 1, x, 1 ]
      when 2 then [ x, 1, z, 1 ]
      when 3 then [ x, y, 1, 1 ]
      when 4 then [ z, x, 1, 1 ]
      when 5 then [ 1, x, y, 1 ]
    [ r*v, g*v, b*v, 1 ]

  @sigmoidal:( x, k, x0=0.5, L=1 ) ->
    L / ( 1 + Math.exp(-k*(x-x0)) )

  # ransform RyGB to RGB hueT
  @toHueRgb:( hue ) ->
    hRgb = 0
    if        0 <= hue and hue <  90 then hRgb =        hue      *  60 / 90
    else if  90 <= hue and hue < 180 then hRgb =  60 + (hue- 90) *  60 / 90
    else if 180 <= hue and hue < 270 then hRgb = 120 + (hue-180) * 120 / 90
    else if 270 <= hue and hue < 360 then hRgb = 240 + (hue-270) * 120 / 90
    hRgb

  @unicode:( icon ) ->
    uc    = FaLookup.icons[icon]
    if not uc?
      console.error( 'Vis.unicode() missing icon in Vis.FontAwesomeUnicodes for', icon )
      uc = "\uf111" # Circle
    uc

  @uniawe:( icon ) ->
    temp = document.createElement("i")
    temp.className = icon
    document.body.appendChild(temp)
    uni = window.getComputedStyle( document.querySelector('.' + icon), ':before' ).getPropertyValue('content')
    console.log( 'uniawe', icon, uni )
    temp.remove()
    uni

`export default Vis`