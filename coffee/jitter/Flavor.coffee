
class Flavor

  Jitter.Flavor = Flavor

  constructor:( @stream ) ->
    @wheel = new Vis.Wheel( @stream )
    @srcLg   = "img/logo/JitterBoxLogo.png"
    @srcRx   = "img/logo/JitterBoxRx.png"
    @srcRy   = "img/logo/JitterBoxRy.png"

  overview:( pane, spec ) ->
    src = "img/flavor/FlavorReady.png"
    $e = $( """<div #{Jitter.panel(0, 0,100,100)}></div>""" )
    $e.append( "<h1 #{Jitter.label(0, 0,100, 10)}>#{spec.name}</h1>" )
    $e.append( """  #{Jitter.image(0,10,100, 90,src,150)}""" )
    pane.$.append( $e )
    return

  ready:( pane, spec, study ) ->
    [@pane,@spec,@study] = [pane,spec,study]
    pane.$.empty()
    name  = if study? then study.name                  else "Jitter"
    url   = if study? then  "json/"+study.json+".json" else "json/flavor.choice.json"
    scale = 1.1 # if study? then study.scale else 1.25
    divId = Util.getHtmlId( "Wheel", name )
    pane.$.append( """     #{Jitter.image( 0, 4,100, 10,@srcLg,15,"","24px") }""" )
    pane.$.append( """     #{Jitter.image(-4, 0, 15, 10,@srcRy,30,"","24px") }""" )
    pane.$.append( """     #{Jitter.image(75, 0, 15, 10,@srcRx,30,"","24px") }""" )
    pane.$.append( """<div #{Jitter.panel( 0, 5,100, 95)} id="#{divId}"></div>""" )

    @wheel.ready( pane, spec, divId, url, scale )
    window.addEventListener("resize", @resize );
    return

  resize:() =>
    @pane.geo = @pane.geom()
    @wheel.resize()

  create:(     pane, spec ) ->
    Util.noop( pane, spec )
    return

