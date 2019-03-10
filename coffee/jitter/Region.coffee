
import Util  from '../util/Util.js'
import UI    from '../ui/UI.js'
import Dom   from '../ui/Dom.js'
import Base  from '../ui/Base.js'

class Region  extends Base

  constructor:( stream, ui ) -> # , @world
    super(      stream, ui, 'Region' )
    # @$img = $()

  subscribe:() ->
    @stream.subscribe( 'Region', 'Region', (region) => @onRegion(region) )
    return

  ready:( cname ) ->
    Util.noop( cname )
    src   = "../img/region/Ethiopia.png"
    $p    = $( """  #{Dom.image(src,90,96,"Ethopia","24px")}""" )
    @$image = $p.find('.dom-image')
    @$label = $p.find('.dom-label')
    @$label.css( "font-size", "#{@pane.toVh(10)}vh" )
    @$label.hide()
    @subscribe()
    $p

  onRegion:( region ) =>

    return if not region? or region.source is 'Region'
    if @stream.isInfo('Region')
       console.info( 'Region.onRegion()', { name:region.name, chosen:region.chosen, flavors:region.flavors } )

    if region.img? and region.img
      src = "../img/region/#{region.name}.png"
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
    choice = UI.toTopic( 'Region', 'Region', addDel, region.name )
    @stream.publish( 'Choice', choice )
    return

export default Region