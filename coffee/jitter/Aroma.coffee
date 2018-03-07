
class Aroma

  Jitter.Aroma = Aroma

  constructor:( @stream ) ->
    @wheel = new Vis.Wheel()

  overview:( pane, spec ) ->
    src = "img/aroma/AromaReady.png"
    $e = $( """<div #{Jitter.rel(0, 0,100,100)}></div>""" )
    $e.append( "<h1 #{Jitter.abs(0, 0,100, 10)}>#{spec.name}</h1>" )
    $e.append( """  #{Jitter.abi(0,10,100, 90,src,150)}""" )
    pane.$.append( $e )
    return

  ready:(    pane, spec ) ->
    @create( pane, spec )
    return

  create:( pane, spec ) ->
    divId = Util.htmlId( "Wheel", "Aroma" )
    url   = "json/aroma.json"
    pane.$.append( """<div #{Jitter.rel(0, 0,100,100)} id="#{divId}"></div>""" )
    pane.$.append( """<h1  #{Jitter.abs(0, 0,100, 10)}>#{spec.name}</h1>""" )
    @wheel.create( pane, spec, divId, url )
    return
