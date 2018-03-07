
class Choice

  Jitter.Choice = Choice

  constructor:( @stream ) ->

  overview:( pane, spec ) ->
    pane.$.append( "<h1>#{spec.name}</h1>" )
    return

  ready:(    pane, spec ) ->
    @create( pane, spec )
    return

  create:( pane, spec ) ->
    pane.$.append( "<h1>#{spec.name}</h1>"  )
    return
