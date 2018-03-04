
class Body

  Jitter.Body = Body

  constructor:( @stream ) ->

  ready:( pane, spec ) ->
    src = "img/body/BodyReady.jpg"
    $e = $( """<div #{Jitter.rel(0, 0,100,100)}></div>""" )
    $e.append( "<h1 #{Jitter.abs(0, 0,100, 10)}>#{spec.name}</h1>" )
    $e.append( """  #{Jitter.abi(0,10,100, 90,src,150)}""" )
    pane.$.append( $e )
    return

  create:( pane, spec ) ->
    $e = $( """<div   #{Jitter.rel(0,0,100,100)}></div>""" )
    $e.append( """<h1 #{Jitter.abs(0,0,100, 10)}>#{spec.name}</h1>""" )
    for y in [10,55]
      for x in [0,33,66]
        $e.append( """<div #{Jitter.abs(x,y,33,45)}>#{x}</div>""" )
    pane.$.append( $e )
    return
