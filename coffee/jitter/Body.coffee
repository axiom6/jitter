
class Body

  Jitter.Body = Body

  constructor:( @stream ) ->

  overview:( pane, spec ) ->
    src = "img/body/Body.jpg"
    $e = $( """<div #{Jitter.panel(0, 0,100,100)}></div>""" )
    $e.append( "<h1 #{Jitter.label(0, 0,100, 10)}>#{spec.name}</h1>" )
    $e.append( """  #{Jitter.image(0,10,100, 90,src,150)}""" )
    pane.$.append( $e )
    return

  ready:(    pane, spec ) ->
    Jitter.vert( pane, spec, 'img/body/', 0.75, 0, 10 )
    return

  create:( pane, spec ) ->
    $e = $( """<div   #{Jitter.panel(0,0,100,100)}></div>""" )
    $e.append( """<h1 #{Jitter.label(0,0,100, 10)}>#{spec.name}</h1>""" )
    where = (key) -> UI.isChild(key)
    array = Util.toArray( spec, where, 'id')
    i = 0
    for y in [10,55]
      for x in [0,33,66]
        $e.append( """<div #{Jitter.image(x,y,33,45)}>
                        <h3>#{array[i].name}</h3>
                      </div>"""  )
        i = i + 1
    pane.$.append( $e )
    return
