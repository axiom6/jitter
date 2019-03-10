

import Util  from '../util/Util.js'
import Vis   from '../vis/Vis.js'
import UI    from '../ui/UI.js'
import Dom   from '../ui/Dom.js'
import Base  from '../ui/Base.js'

class Roast extends Base

  Roast.Table = {
    "1":{ color:"#dba34e", img:"1d.png", name:"Blonde",   value: 5, style:"Half City"      },
    "2":{ color:"#c48a43", img:"2d.png", name:"Light",    value:15, style:"Cinnamon"       },
    "3":{ color:"#996b31", img:"3d.png", name:"City",     value:25, style:"City"           },
    "4":{ color:"#795424", img:"4d.png", name:"Full",     value:35, style:"Full City"      },
    "5":{ color:"#6d4a1f", img:"5d.png", name:"Medium",   value:45, style:"Full City Plus" },
    "6":{ color:"#553916", img:"6d.png", name:"Vienna",   value:55, style:"Vienna"         },
    "7":{ color:"#492c0f", img:"7d.png", name:"Dark",     value:65, style:"Italian"        },
    "8":{ color:"#40250d", img:"8d.png", name:"French",   value:75, style:"French"         },
    "9":{ color:"#2f1c09", img:"9d.png", name:"Black",    value:85, style:"Black"          } }

  constructor:( stream, ui ) ->
    super(      stream, ui, 'Roast' )
    @max  = 90
    @data = Roast.Table
    @stream.subscribe( 'Choice', 'Roast', (choice) => @onChoice(choice) )

  ready:( cname ) ->
    Util.noop( cname )
    src = "../img/roast/RoastsBig.png"
    n   = Util.lenObject( @data )
    x   = 0
    dx  = 100 / n # - 0.07
    $p = $( """<div #{Dom.panel( 0, 0,100,100)}></div>""" )
    $p.css( { "border-radius":"24px" } )

    style  = """position:absolute; left:2%; top:5%; width:9%; height:90%; """
    style += """text-align:center; background:#{@data["5"].color}; """
    style += """border:black solid 2px; font-size:3vmin; font-weight:bold; display:table; opacity:#{Dom.opacity}"""
    spanc  = """position:absolute; left:0; top:2%; width:100%; height:12%; color:yellow; font-size:2vmin; z-index:4;"""
    spanr  = """display:table-cell; vertical-align:middle; line-height:normal; """
    $p.append("""<div id="RoastColor" style="#{style}">
      <div style="#{spanc}" id="RoastName">#{@data["5"].name}</div>
      <div style="#{spanr}">Roast</div></div>""" )

    $r =    $( """<div #{Dom.label(13, 5, 84, 90,"roast")}></div>""" )
    $r.append( """<img style="width:100%; height:75%;" src="#{src}"/>""")

    style  = "position:absolute; left:0; top:81%; width:100%; height:#{16}% ;"
    style += "padding:0; margin:0; z-index:2;"
    $r.append( """<input id="RoastInput" type="range" min="0" max="#{@max}" style="#{style}"></input>""" )
    for own key, roast of @data  #
      style  = """position:absolute; left:#{x}%; top:0; width:#{dx}%; height:#{75}%; """
      style += """text-align:center; background:transparent ;"""
      style += """border:black solid 1px; color:yellow; font-size:2vmin; padding-top:0.2vmin;"""
      style += """border-right:black solid 3px;""" if key is "9"
      $r.append("""<div style="#{style}">#{roast.name}</div>""")
      style  = """position:absolute; left:#{x}%; top:#{75}%; width:#{dx}%; height:#{25}% ;"""
      style += """text-align:center; background:#{roast.color}; opacity:#{Dom.opacity};"""
      style += """border:black solid 2px;"""
      $r.append("""<div style="#{style}"></div>""")
      x = x + dx
    @$input = $r.find("#RoastInput")
    @$input.on( "change", (event) => @doInputEvent(event) )
    $p.append( $r )
    $p

  doInputEvent:( event ) =>
    value  = parseInt(event.target.value)
    @doInput( value, true )

  doInput:( v, pub ) =>
    n  = 9
    s  = @max / n
    p  = Math.min( Math.ceil(v/s), n )
    m  = 0
    p1 = 0
    p2 = 0
    r  = 0
    [p,m] = if p < 1 then [1,s/2] else [p,(p-0.5)*s]
    [p1,p2,r] =
      if      v >= m and p < n-1 then [ p,  p+1,   (v-m)/n ]
      else if v <  m and p >= 2  then [ p-1,p,   1-(m-v)/n ]
      else                            [ p,  p,   1         ]

    h1  = Vis.cssHex( @data[p1].color )
    h2  = Vis.cssHex( @data[p2].color )
    rgb = Vis.rgbCss( Vis.interpolateHexRgb( h1, 1.0-r, h2, r ) )
    @$pane.find("#RoastColor").css( { background:rgb } ) if @$pane?
    @$pane.find("#RoastName" ).text(  @data[p].name    ) if @$pane?
    @$input.val( v ) if 0 <= v and v <= @max
    @publish( @data[p], v ) if pub
    return

  publish:( study, v ) ->
    name         = study.name
    study.chosen = if not ( study.chosen? or study.chosen ) then true else false
    addDel       = if study.chosen then UI.AddChoice    else UI.DelChoice
    color        = if study.chosen then Dom.choiceColor else Dom.basisColor
    choice = UI.toTopic( 'Roast', 'Roast', addDel, name )
    choice.value = v if v?
    @stream.publish( 'Choice', choice )
    color

  onChoice:( choice ) =>
    return  if choice.source is 'Roast' or choice.name isnt 'Roast' or choice.intent is UI.DelChoice
    console.info( 'Roast.onChoice()', choice ) if @stream.isInfo('Choice')
    value = if choice.value? then choice.value else @getValue( choice.study )
    @doInput( value, false ) if value isnt -1
    return

  getValue:( name ) ->
    for key, roast of Roast.Table
      return roast.value if roast.name is name
    console.error( "Roast.getValue() roast #{name} missing return average value of 45" )
    45

export default Roast