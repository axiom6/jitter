
class Roast

  Jitter.Roast = Roast

  Roast.Roasts = {
    "1":{ color:"#ad8d70", img:"1d.png" },
    "2":{ color:"#99795f", img:"2d.png" },
    "3":{ color:"#8d6b54", img:"3d.png" },
    "4":{ color:"#826349", img:"4d.png" },
    "5":{ color:"#746457", img:"5d.png" },
    "6":{ color:"#67625e", img:"6d.png" },
    "7":{ color:"#555b57", img:"7d.png" },
    "8":{ color:"#494a45", img:"8d.png" },
    "9":{ color:"#3e3f3a", img:"9d.png" } }

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
    $r.append(     """<input id="RoastInput" type="range" min="1", max="90" style="#{style}"></input>""" )
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
    v = parseInt(event.target.value)
    n = 9
    p = Math.ceil(v/(n+1))

    p1 = p
    p2 = if v > 5 and p < 9 then p+1 else p
    h1 = Vis.cssHex( Roast.Roasts[p1].color )
    h2 = Vis.cssHex( Roast.Roasts[p2].color )
    m1 = p1*10-5
    m2 = p2*10-5
    r1 = (m2-v)/10
    r2 = 1-r1
    rgb = Vis.rgbCss( Vis.interpolateHexRgb( h1, r1, h2, r2 ) )
    #gb = Vis.rndRgb( rgb )
    #console.log( "doInput", { v:v, p1:p1, p:p, p2:p2, m1:m1, m2:m2, r1:r1, r2:r2, rgb:rgb } )
    $("#RoastColor").css( { background:rgb } )
    return

  ###
  ready2:( pane, spec ) ->
    [@pane,@spec] = [pane, spec]
    dir = "img/roast/"
    n   = Util.lenObject( Roast.Roasts )
    x   = 0
    dx  = 100 / n
    pane.$.append( """<div #{Jitter.panel( 0, 0,100,100)}></div>""" )
    pane.$.append( """<div #{Jitter.label( 3,42,  7, 16)}>#{spec.name}</div>""" )
    $r  = $(       """<div #{Jitter.label(10, 5, 90, 85,"roast")}></div>""" )
    for own key, roast of Roast.Roasts
      src   = dir + roast.img
      $s    = $("""<div #{Jitter.label( x, 0, dx,100,"roast")}></div>""" )
      $s.append("""<img style="width:80px; height:80px;" src="#{src}"/>""")
      $s.append("""<div style="width:100%; height:20%; background:#{roast.color};"></div>""")
      $r.append( $s )
      x = x + dx
    pane.$.append( $r )
    return


  ready1:( pane, spec ) ->
    [@pane,@spec] = [pane, spec]
    src = "img/roast/RoastsBig.png"
    pane.$.append( """<div   #{Jitter.panel( 0, 0,100,100)}></div>""" )
    pane.$.append(  """<div #{Jitter.label( 3,42, 10, 16)}>#{spec.name}</div>""" )
    $i = $("""#{@image( 16, 8, 75, 78, src, 15 ) }"""  )
    $i.append("""<div #{Jitter.label( 3,82,16, 10,"roast")}>Light</div>""")
    $i.append("""<div #{Jitter.label(24,82,16, 10,"roast")}>Medium Light</div>""")
    $i.append("""<div #{Jitter.label(42,82,16, 10,"roast")}>Medium</div>""")
    $i.append("""<div #{Jitter.label(66,82,16, 10,"roast")}>Medium Dark</div>""")
    $i.append("""<div #{Jitter.label(86,82,16, 10,"roast")}>Dark</div>""")
    pane.$.append( $i  )
    pane.$.append( "</div></div>"  )
    $(".roast").on( 'click', (event) => @doClick(event) )
    return
  ###

  doClick:( event ) =>
    $e    = $(event.target)
    name  = $e.text()
    key   = name.replace( " ", "" )
    study = @spec[key]
    study.chosen = if not ( study.chosen? or study.chosen ) then true else false
    addDel       = if study.chosen then UI.AddChoice       else UI.DelChoice
    color        = if study.chosen then Jitter.choiceColor else Jitter.basisColor
    $e.css( { color:color } )
    choice = UI.select( 'Roast', 'Jitter', addDel, name )
    choice.$click = $e
    Jitter.stream.publish( 'Choice', choice )
    return

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
