

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
