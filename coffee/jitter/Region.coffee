
`import Util from '../util/Util.js'`
`import UI   from '../ui/UI.js'`
`import Dom  from '../ui/Dom.js'`

class Region

  constructor:( @stream, @ui, @world ) ->
    @ui.addContent( 'Region', @ )
    @$img = $()

  subscribe:() ->
    @stream.subscribe( 'Region', 'Region', (region) => @onRegion(region) )
    @stream.subscribe( 'Choice', 'Region', (choice) => @onChoice(choice) )
    return

  readyPane:() ->
    src   = "img/region/Ethiopia.png"
    $p    = $( """  #{Dom.image(src,@pane.toVh(90),@pane.toVw(96),"Ethopia","24px")}""" )
    @$image = $p.find('.dom-image')
    @$label = $p.find('.dom-label')
    @$label.css( "font-size", "#{@pane.toVh(10)}vh" )
    @$label.hide()
    @subscribe()
    $p

  readyView:() =>
    $("""<h1 style=" display:grid; justify-self:center; align-self:center; ">Region</h1>""" )

  onRegion:( region ) =>

    return if not region? or region.source is 'Region'
    if @stream.isInfo('Region')
       console.info( 'Region.onRegion()', { name:region.name, chosen:region.chosen, flavors:region.flavors } )

    if region.img? and region.img
      src = "img/region/#{region.name}.png"
      @$label.hide()
      @$image.attr( 'src', src ).show()
    else
      label = Util.toName( region.name ) # Puts spaces between Camel Case text
      @$image.hide()
      @$label.text(label).show()

    # Publish Region to update Flavors
    if Util.isArray(region.flavors) # This really to update Flavors
      region.source  = 'Region'
      @stream.publish( 'Region', region )

    # Publish Choice to update Summaries
    addDel = if region.chosen then UI.AddChoice else UI.DelChoice
    choice = UI.select( 'Region', 'Region', addDel, region.name )
    @stream.publish( 'Choice', choice )
    return

  onChoice:( choice ) =>
    return if choice.name isnt 'Region' or choice.source is 'Region'
    region = @world.regions[choice.study]
    console.info( 'Region.onChoice()', choice ) if @stream.isInfo('Choice')
    @onRegion( region, false ) if region?
    return

`export default Region`