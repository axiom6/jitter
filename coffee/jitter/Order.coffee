
class Order

  Jitter.Order = Order

  constructor:( @stream ) ->

  ready:( pane, spec ) ->
    pane.$.append( "<h1>#{spec.name}</h1>" )
    return

  create:( pane, spec ) ->
    pane.$.append( "<h1>#{spec.name}</h1>"  )
    return
