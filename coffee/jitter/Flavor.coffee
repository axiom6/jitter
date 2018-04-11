
`import UI    from '../ui/UI.js'`
`import Dom   from '../ui/Dom.js'`
`import Vis   from '../vis/Vis.js'`
`import Wheel from '../vis/Wheel.js'`

class  Flavor

  constructor:( @stream, @ui, @name ) ->
    @ui.addContent( @name, @ )
    @wheel = new Wheel( @stream )
    @prevRegion = null
    @srcLg = "img/logo/JitterBoxHead.png"
    @srcRx = "img/logo/JitterBoxRx.png"
    @srcRy = "img/logo/JitterBoxRy.png"

  readyPane:() ->
    url   = "json/flavor.choice.json"
    scale = 1.3
    divId = UI.getHtmlId( "Wheel", @pane.name )
    #p = @pane.$
    #p.append( """     #{Dom.image( 0, 0,100, 10,@srcLg,15,"","24px") }""" )
    #p.append( """     #{Dom.image(-4, 0, 15, 10,@srcRy,30,"","24px") }""" )
    #p.append( """     #{Dom.image(75, 0, 15, 10,@srcRx,30,"","24px") }""" )
    $w =    $( """<div #{Dom.panel( 0, 5,100, 95)} id="#{divId}"></div>""" )
    #w.css( { "background-image":"url(img/flavor/jitterPourOverBg.png)" } )
    #w.css( { "background-color":"#8d6566" } )
    @wheel.ready( @pane, @spec, $w.get(0), url, scale )
    window.addEventListener("resize", @resize );
    @subscribe( @name )
    $w

  resize:() =>
    @pane.geo = @pane.geom()
    @wheel.resize()

  subscribe:( name ) ->
    @stream.subscribe( 'Region', (select) => @onRegion(select) ) if name is 'Flavors'
    return

  onRegion:( select ) =>
    region = select.study
    console.log( 'Flavors.onRegion()', { name:region.name, flavors:region.flavors } ) if region?
    return if true
    if @prevRegion? and @prevRegion.flavors?
      for  flavor  in   @prevRegion.flavors
        d = @wheel.lookup[flavor]
        @wheel.magnify( d, 'click' ) if d?
    if region? and  region.flavors?
      for flavor in region.flavors
        d = @wheel.lookup[flavor]
        @wheel.magnify( d, 'click' ) if d?
      @prevRegion = region
    return

  readyView:() ->
    src = "img/flavor/Flavor.png"
    @$view.append( """<div #{Dom.panel(0, 0,100,100)}></div>""" )
    @$view.append( """<h1  #{Dom.label(0, 0,100, 10)}>Flavor</h1>""" )
    @$view.append( """     #{Dom.image(0,10,100, 90,src,150)}""" )
    @$view

`export default Flavor`

