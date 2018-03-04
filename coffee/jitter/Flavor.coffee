
class Flavor

  Jitter.Flavor = Flavor

  constructor:( @stream ) ->

  ready:( pane, spec ) ->
    src = "img/flavor/FlavorReady.png"
    $e = $( """<div #{Jitter.rel(0, 0,100,100)}></div>""" )
    $e.append( "<h1 #{Jitter.abs(0, 0,100, 10)}>#{spec.name}</h1>" )
    $e.append( """  #{Jitter.abi(0,10,100, 90,src,150)}""" )
    pane.$.append( $e )
    return

  create:( pane, spec ) ->
    UI.plotId = "FlavorVisual"
    UI.jsonD3 = "json/flavor.jitter.json"
    pane.$.append( """<h1>#{spec.name}</h1>""" )
    pane.$.append( """<div id="#{UI.plotId}">&nbsp;</div>"""  )
    Util.loadScript( "js/wheel/flavor.v3.js" )
    return
