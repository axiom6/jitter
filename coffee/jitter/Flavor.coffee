
class Flavor

  Jitter.Flavor = Flavor

  constructor:( @stream, @jitter ) ->
    @jitter.addContent( 'Flavor', @ )
    @wheel = new Vis.Wheel( @stream )
    @srcLg = "img/logo/JitterBoxLogo.png"
    @srcRx = "img/logo/JitterBoxRx.png"
    @srcRy = "img/logo/JitterBoxRy.png"

  readyPane:() ->
    url   = "json/flavor.choice.json"
    scale = 1.1
    divId = Util.getHtmlId( "Wheel", @pane.name )
    $p = @pane.$
    $p.append( """     #{UI.Dom.image( 0, 4,100, 10,@srcLg,15,"","24px") }""" )
    $p.append( """     #{UI.Dom.image(-4, 0, 15, 10,@srcRy,30,"","24px") }""" )
    $p.append( """     #{UI.Dom.image(75, 0, 15, 10,@srcRx,30,"","24px") }""" )
    $w =    $( """<div #{UI.Dom.panel( 0, 5,100, 95)} id="#{divId}"></div>""" )
    @wheel.ready( @pane, @spec, $w.get(0), url, scale )
    window.addEventListener("resize", @resize );
    $w

  resize:() =>
    @pane.geo = @pane.geom()
    @wheel.resize()

  readyView:() ->
    src = "img/flavor/Flavor.png"
    @$view.append( """<div #{UI.Dom.panel(0, 0,100,100)}></div>""" )
    @$view.append( """<h1 #{UI.Dom.label(0, 0,100, 10)}>Flavor</h1>""" )
    @$view.append( """    #{UI.Dom.image(0,10,100, 90,src,150)}""" )
    @$view




