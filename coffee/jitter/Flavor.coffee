
class Flavor

  Jitter.Flavor = Flavor

  constructor:( @stream ) ->
    @wheel = new Vis.Wheel()

  ready:( pane, spec ) ->
    src = "img/flavor/FlavorReady.png"
    $e = $( """<div #{Jitter.rel(0, 0,100,100)}></div>""" )
    $e.append( "<h1 #{Jitter.abs(0, 0,100, 10)}>#{spec.name}</h1>" )
    $e.append( """  #{Jitter.abi(0,10,100, 90,src,150)}""" )
    pane.$.append( $e )
    return

  create:( pane, spec, study ) ->
    name  =  if study? then study.name                  else "Jitter"
    url   =  if study? then  "json/"+study.json+".json" else "json/flavor.jitter.json"
    divId =  Util.getHtmlId( "Wheel", name )
    pane.$.append( """<h1>#{spec.name} #{name}</h1>""" )
    pane.$.append( """<div id="#{divId}">&nbsp;</div>"""  )
    @wheel.create( pane, spec, divId, url )
    return

