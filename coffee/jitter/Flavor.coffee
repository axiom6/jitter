
class Flavor

  Jitter.Flavor = Flavor

  constructor:( @stream ) ->
    @wheel = new Vis.Wheel()

  overview:( pane, spec ) ->
    src = "img/flavor/FlavorReady.png"
    $e = $( """<div #{Jitter.rel(0, 0,100,100)}></div>""" )
    $e.append( "<h1 #{Jitter.abs(0, 0,100, 10)}>#{spec.name}</h1>" )
    $e.append( """  #{Jitter.abi(0,10,100, 90,src,150)}""" )
    pane.$.append( $e )
    return

  ready:(    pane, spec ) ->
    @create( pane, spec )
    return

  create:( pane, spec, study ) ->
    name  = if study? then study.name                  else "Jitter"
    url   = if study? then  "json/"+study.json+".json" else "json/flavor.jitter.json"
    scale = if study? then study.scale else 1.25
    divId = Util.getHtmlId( "Wheel", name )
    pane.$.append( """<div #{Jitter.rel( 0, 0,100,100)} id="#{divId}"></div>""" )
    pane.$.append( """<div #{Jitter.abs(41,49, 20, 10)}>Flavor</div>""" )
    @wheel.create( pane, spec, divId, url, scale )
    return

