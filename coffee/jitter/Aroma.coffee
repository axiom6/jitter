
class Aroma

  Jitter.Aroma = Aroma

  constructor:( @stream ) ->
    @wheel = new Vis.Wheel()

  ready:( pane, spec ) ->
    src = "img/aroma/AromaReady.png"
    $e = $( """<div #{Jitter.rel(0, 0,100,100)}></div>""" )
    $e.append( "<h1 #{Jitter.abs(0, 0,100, 10)}>#{spec.name}</h1>" )
    $e.append( """  #{Jitter.abi(0,10,100, 90,src,150)}""" )
    pane.$.append( $e )
    return

  create:( pane, spec ) ->
    UI.plotId = "AromaVisual"
    UI.jsonD3 = "json/aroma.json"
    pane.$.append( """<h1>#{spec.name}</h1>""" )
    pane.$.append( """<div id="#{UI.plotId}">&nbsp;</div>""" )
    Util.loadScript( "js/wheel/flavor.v3.js" )
    return

  create:( pane, spec ) ->
    divId = Util.htmlId( "Wheel", "Aroma" )
    url   = "json/aroma.json"
    pane.$.append( """<h1>#{spec.name}</h1>""" )
    pane.$.append( """<div id="#{divId}">&nbsp;</div>"""  )
    @wheel.create( pane, spec, divId, url )
    return
