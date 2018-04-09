

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

Roast.Choice = {
  "1":{ color:"#c99a76", img:"1d.png", name:"Blonde"  },
  "2":{ color:"#9d7859", img:"2d.png", name:"Very Light"   },
  "3":{ color:"#99795f", img:"3d.png", name:"Light"        },
  "4":{ color:"#826349", img:"4d.png", name:"Medium Light" },
  "5":{ color:"#5d462f", img:"5d.png", name:"Medium"       },
  "6":{ color:"#432f1c", img:"6d.png", name:"Medium Dark"  },
  "7":{ color:"#555b57", img:"7d.png", name:"Dark"         },
  "8":{ color:"#494a45", img:"8d.png", name:"Very Dark"    },
  "9":{ color:"#2f1c09", img:"9d.png", name:"Ultra Dark"   } }

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
