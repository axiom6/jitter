
class Roast

  Jitter.Roast = Roast

  constructor:( @stream ) ->

  ready:( pane, spec ) ->
    src = "img/roast/Coffee-Bean-Roast-Ready.jpg"
    $e = $( """<div #{Jitter.rel(0, 0,100,100)}></div>""" )
    $e.append( "<h1 #{Jitter.abs(0, 0,100, 10)}>#{spec.name}</h1>" )
    $e.append( """  #{Jitter.abi(0,10,100, 90,src,150)}""" )
    pane.$.append( $e )
    return

  create:( pane, spec ) ->
    pane.$.append( "<h1>#{spec.name}</h1>" )
    $e = $( """<div #{Jitter.rel(0,0,100,100)}></div>""" )
    src = "img/roast/FiveRoasts.jpeg"
    $e.append( """<img #{Jitter.img(src)}/>""" )
    #$e.append( """<div><span>Light</span><span>Medium Light</span><span>Medium</span><span>Medium Dark</span><span>Dark</span></div>""")
    pane.$.append( $e  )
    return
