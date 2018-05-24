
`import Util  from '../util/Util.js'`
`import UI    from '../ui/UI.js'`
`import Dom   from '../ui/Dom.js'`
`import Vis   from '../vis/Vis.js'`
`import Wheel from '../jitter/Wheel.js'`

class  Flavor

  constructor:( @stream, @ui, @name ) ->
    @ui.addContent( @name, @ )
    @wheel = new Wheel( @publish, Dom.opacity )
    @prevRegion = null

  # Passed as a callback to Wheel and called when Wheel makes a choice to be published
  publish:( add, flavor, roast ) =>
    addDel    = if add then UI.AddChoice else UI.DelChoice
    @spec.num = if add then @spec.num+1  else @spec.num-1
    if @spec.num <= @spec.max
      choice = UI.toTopic( @spec.name, 'Wheel', addDel, flavor )
      choice.value = roast
      @stream.publish( 'Choice', choice )
    else
      @spec.num = @spec.num-1
      alert( "You can only make #{@spec.max} choices for Flavor" )
      @onWheel( 'DelChoice', flavor )
    return

  subscribe:( name ) ->
    @stream.subscribe( 'Region', name, (region) => @onRegion(region) ) if name is 'Flavors'
    @stream.subscribe( 'Choice', name, (choice) => @onChoice(choice) ) if name is 'Flavor'
    return

  readyPane:() ->
    url   = "json/flavor.choice.json"
    scale = 1.1
    divId = @ui.getHtmlId( "Wheel", @pane.name )
    $w =    $( """<div #{Dom.panel( 0, 5,100, 95)} id="#{divId}"></div>""" )
    @wheel.ready( @pane, @spec, $w.get(0), url, scale )
    window.addEventListener("resize", @resize );
    @subscribe( @name )
    $w

  resize:() =>
    @pane.geo = @pane.geom()
    @wheel.resize()
    return

  onRegion:( region ) =>

    if region? and @stream.isInfo('Region')
      console.info( 'Flavor.onRegion()', { instance:@name, name:region.name, flavors:region.flavors } )
    return if @name is 'Flavor' # Only the Flavors name instance responds to onRegion()

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
    return if not ( choice.name is 'Flavor'                           ) or choice.source is 'Flavor'
    #eturn if not ( choice.name is 'Flavor' or choice.name is 'Roast' ) or choice.source is 'Flavor'
    flavor = ""
    if choice.name is 'Flavor' and Util.isStr(choice.study)
       flavor = choice.study
    else if choice.name is 'Roast' and choice.value?
       flavor = @wheel.getFlavorName(  choice.value )
    addDel = if choice.intent is UI.AddChoice then 'AddChoice' else 'DelChoice'
    @onWheel( addDel, flavor ) if Util.isStr(flavor )
    return

  readyView:() =>
    $("""<h1 style=" display:grid; justify-self:center; align-self:center; ">Flavor</h1>""" )

`export default Flavor`

