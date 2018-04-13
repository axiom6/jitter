
`import Util  from '../util/Util.js'`
`import UI    from '../ui/UI.js'`
`import Dom   from '../ui/Dom.js'`
`import Vis   from '../vis/Vis.js'`
`import Wheel from '../vis/Wheel.js'`

class  Flavor

  constructor:( @stream, @ui, @name ) ->
    @ui.addContent( @name, @ )
    @wheel = new Wheel( @publish, Dom.opacity )
    @prevRegion = null
    @srcLg = "img/logo/JitterBoxHead.png"
    @srcRx = "img/logo/JitterBoxRx.png"
    @srcRy = "img/logo/JitterBoxRy.png"

  # Passed as a callback to Wheel and called when Wheel makes a choice to be published
  publish:( add, flavor ) =>
    addDel    = if add then UI.AddChoice else UI.DelChoice
    @spec.num = if add then @spec.num+1  else @spec.num-1
    if @spec.num <= @spec.max
      choice = UI.select( @spec.name, 'Wheel', addDel, flavor )
      @stream.publish( 'Choice', choice )
    else
      @spec.num = @spec.num-1
      alert( "You can only make #{@spec.max} choices for Flavor" )
      @onWheel( 'DelChoice', flavor )
    return

  subscribe:( name ) ->
    @stream.subscribe( 'Region', (select) => @onRegion(select) ) if name is 'Flavors'
    @stream.subscribe( 'Choice', (choice) => @onChoice(choice) ) if name is 'Flavor'
    return

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
    return

  onRegion:( select ) =>
    region = select.study
    #console.log( 'Flavors.onRegion()', { name:region.name, flavors:region.flavors } ) if region?
    if @prevRegion? and @prevRegion.flavors?
      for  flavor  in   @prevRegion.flavors
        @onWheel( 'DelChoice', flavor )
    if region? and  region.flavors?
      for flavor in region.flavors
        @onWheel( 'AddChoice', flavor )
      @prevRegion = region
    return

  onWheel:( addDel, flavor ) ->
    d = @wheel.lookup[flavor]
    @wheel.onEvent( d, addDel ) if d?
    return

  onChoice:( choice ) =>
    return if choice.name isnt 'Flavor' or Util.isntStr(choice.study)
    addDel = if choice.intent is UI.AddChoice then 'AddChoice' else 'DelChoice'
    @onWheel( addDel, choice.study )
    return

  readyView:() ->
    src = "img/flavor/Flavor.png"
    @$view.append( """<div #{Dom.panel(0, 0,100,100)}></div>""" )
    @$view.append( """<h1  #{Dom.label(0, 0,100, 10)}>Flavor</h1>""" )
    @$view.append( """     #{Dom.image(0,10,100, 90,src,150)}""" )
    @$view

`export default Flavor`

