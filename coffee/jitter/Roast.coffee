
class Roast

  Jitter.Roast = Roast

  Roast.Roasts = {
    "1":{ color:"#ad8d70", img:"1d.png", name:"Ultra Light"  },
    "2":{ color:"#99795f", img:"2d.png", name:"Very Light"   },
    "3":{ color:"#8d6b54", img:"3d.png", name:"Light"        },
    "4":{ color:"#826349", img:"4d.png", name:"Medium Light" },
    "5":{ color:"#746457", img:"5d.png", name:"Medium"       },
    "6":{ color:"#67625e", img:"6d.png", name:"Medium Dark"  },
    "7":{ color:"#555b57", img:"7d.png", name:"Dark"         },
    "8":{ color:"#494a45", img:"8d.png", name:"Very Dark"    },
    "9":{ color:"#3e3f3a", img:"9d.png", name:"Ultra Dark"   } }

  Roast.RoastsBak = {
    "1":{ color:"#ad8d70", img:"1d.png" },
    "2":{ color:"#7b835a", img:"2d.png" },
    "3":{ color:"#99795f", img:"3d.png" },
    "4":{ color:"#826349", img:"4d.png" },
    "5":{ color:"#72654d", img:"5d.png" },
    "6":{ color:"#67625e", img:"6d.png" },
    "7":{ color:"#615b57", img:"7d.png" },
    "8":{ color:"#494a45", img:"8d.png" },
    "9":{ color:"#3e3f3a", img:"9d.png" } }

  Roast.Roasts5 = {
    "1":{ color:"#a69c7f", img:"1.png" },
    "3":{ color:"#8b7059", img:"3.png" },
    "6":{ color:"#675346", img:"6.png" },
    "8":{ color:"#3d4037", img:"8.png" },
    "A":{ color:"#141e1b", img:"A.png" } }

  Roast.Roasts10 = {
    "1":{ color:"#a69c7f", img:"1.png" }, "2":{ color:"#b8927a", img:"2.png" },
    "3":{ color:"#8b7059", img:"3.png" }, "4":{ color:"#7e8652", img:"4.png" },
    "5":{ color:"#6b574a", img:"5.png" }, "6":{ color:"#675346", img:"6.png" },
    "7":{ color:"#6a5b4a", img:"7.png" }, "8":{ color:"#3d4037", img:"8.png" },
    "9":{ color:"#3c3f36", img:"9.png" }, "A":{ color:"#141e1b", img:"A.png" } }

  constructor:( @stream ) ->
    @max = 100

  overview:( pane, spec ) ->
    src = "img/roast/Coffee-Bean-Roast-Ready.jpg"
    $e = $( """<div #{Jitter.panel(0, 0,100,100)}></div>""" )
    $e.append( "<h1 #{Jitter.label(0, 0,100, 10)}>#{spec.name}</h1>" )
    $e.append( """  #{Jitter.image(0,10,100, 90,src,150)}""" )
    pane.$.append( $e )
    return

  ready:( pane, spec ) ->
    [@pane,@spec] = [pane, spec]
    src = "img/roast/RoastsBig.png"
    n   = Util.lenObject( Roast.Roasts )
    x   = 0
    dx  = 100 / n # - 0.07
    pane.$.append( """<div #{Jitter.panel( 0, 0,100,100)}></div>""" )

    style  = """position:absolute; left:2%; top:5%; width:9%; height:90% ;"""
    style += """text-align:center; background:#{Roast.Roasts["5"].color}; """
    style += """border:black solid 2px; color:white; font-size:3vmin; font-weight:bold; display: table;"""
    spans  = """ display: table-cell; vertical-align: middle; line-height: normal; """
    pane.$.append("""<div id="RoastColor" style="#{style}"><span style="#{spans}">#{spec.name}</span></div>""")

    $r  = $(       """<div #{Jitter.label(13, 5, 84, 90,"roast")}></div>""" )
    $r.append(     """<img style="width:100%; height:75%;" src="#{src}"/>""")

    style  = "position:absolute; left:0; top:81%; width:100%; height:#{16}% ;"
    style += "padding:0; margin:0; z-index:2;"
    $r.append(     """<input id="RoastInput" type="range" min="0" max="#{@max}" style="#{style}"></input>""" )
    for own key, roast of Roast.Roasts  #
      style  = """position:absolute; left:#{x}%; top:0; width:#{dx}%; height:#{75}%; """
      style += """text-align:center; background:transparent ;"""
      style += """border:black solid 1px;"""
      style += """border-right:black solid 3px;""" if key is "9"
      $r.append("""<div style="#{style}"></div>""")
      style  = """position:absolute; left:#{x}%; top:#{75}%; width:#{dx}%; height:#{25}% ;"""
      style += """text-align:center; background:#{roast.color} ;"""
      style += """border:black solid 2px;"""
      $r.append("""<div style="#{style}"></div>""")
      x = x + dx

    pane.$.append( $r )
    $("#RoastInput").on( "change", (event) => @doInput(event) )
    return

  doInput:( event ) =>
    v  = parseInt(event.target.value)
    n  = 9
    s  = @max / n
    p  = Math.min( Math.ceil(v/s), n )
    [p,m] = if p < 1 then [1,s/2] else [p,(p+0.5)*s]
    [p1,p2,r] =
      if      v > m and p <  n-1 then [ p,  p+1,   (v-m)/n ]
      else if v < m and p >= 2   then [ p-1,p,   1-(m-v)/n ]
      else                            [ p,  p,   1         ]

    console.log( "doInput1", { v:v, m:m, r, p1:p1, p:p, p2:p2, s:s } )
    h1 = Vis.cssHex( Roast.Roasts[p1].color )
    h2 = Vis.cssHex( Roast.Roasts[p2].color )
    rgb = Vis.rgbCss( Vis.interpolateHexRgb( h1, 1.0-r, h2, r ) )
    $("#RoastColor").css( { background:rgb } )
    @publish( Roast.Roasts[p].name, null, v )
    return

  doClick:( event ) =>
    $e    = $(event.target)
    name  = $e.text()
    color = @publish( name, $e=null )
    $e.css( { color:color } )
    return

  publish:( name, $e=null, v=undefined ) ->
    key   = name.replace( " ", "" )
    study = @spec[key]
    study.chosen = if not ( study.chosen? or study.chosen ) then true else false
    addDel       = if study.chosen then UI.AddChoice       else UI.DelChoice
    color        = if study.chosen then Jitter.choiceColor else Jitter.basisColor
    choice = UI.select( 'Roast', 'Jitter', addDel, name )
    choice.value = v if v?
    #choice.$click = $e if $e?
    console.log( "Roast.publish", choice )
    Jitter.stream.publish( 'Choice', choice )
    color

  image:( x, y, w, h, src, mh ) -> # max-height:#{mh}vmin;
    klass  = if src? then "image"            else "texts"
    htm  = """<div class="#{klass}" style="position:absolute; left:#{x}%; top:#{y}%; width:#{w}%; height:#{h}%; display:table;">"""
    htm += """<div style="display:table-cell; vertical-align:middle;">"""
    htm += """<img style="display:block; margin-left:auto; margin-right:auto;  width:100%; max-height:#{mh}vmin; border-radius:24px;" src="#{src}"/>""" if src?
    htm

  create:( pane, spec ) ->
    pane.$.append( "<h1>#{spec.name}</h1>" )
    $e = $( """<div #{Jitter.rel(0,0,100,100)}></div>""" )
    src = "img/roast/FiveRoasts.jpeg"
    $e.append( """<img #{Jitter.img(src)}/>""" )
    #$e.append( """<div><span>Light</span><span>Medium Light</span><span>Medium</span><span>Medium Dark</span><span>Dark</span></div>""")
    pane.$.append( $e  )
    return
