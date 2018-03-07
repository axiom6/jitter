
class Drink

  Jitter.Drink = Drink

  constructor:( @stream ) ->

  overview:( pane, spec ) ->
    src = "img/drink/DrinkReady.jpg"
    $e = $( """<div #{Jitter.rel(0, 0,100,100)}></div>""" )
    $e.append( "<h1 #{Jitter.abs(0, 0,100, 10)}>#{spec.name}</h1>" )
    $e.append( """  #{Jitter.abi(0,10,100, 90,src,150)}""" )
    pane.$.append( $e )
    return

  ready:(    pane, spec ) ->
    $e = $( """<div   #{Jitter.rel(0,0,100,100)}></div>""" )
    $e.append( """<h2 #{Jitter.abs(0,0,100, 10)}>#{spec.name}</h2>""" )
    where = (key) -> UI.isChild(key)
    array = Util.toArray( spec, where, 'id')
    i = 0
    x = 0
    for y in [10,23,36,49,62,75,88]
      src = "img/drink/"+array[i].icon
      $e.append( """#{Jitter.abi(x,y,100,13,src,80,array[i].name)}"""  )
      i = i + 1
    pane.$.append( $e )
    return
    return

  create:( pane, spec ) ->
    $e = $( """<div   #{Jitter.rel(0,0,100,100)}></div>""" )
    $e.append( """<h1 #{Jitter.abs(0,0,100, 10)}>#{spec.name}</h1>""" )
    where = (key) -> UI.isChild(key)
    array = Util.toArray( spec, where, 'id')
    i = 0
    for y in [10,55]
      for x in [0,33,66]
        $e.append( """<div #{Jitter.abs(x,y,33,45)}><h3>#{array[i].name}</h3></div>"""  )
        i = i + 1
    pane.$.append( $e )
    return
