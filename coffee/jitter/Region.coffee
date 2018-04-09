
import Util from '../util/Util.js'
import Dom  from '../ui/Dom.js'

export default class Region

  constructor:( @stream, @ui ) ->
    @ui.addContent( 'Region', @ )
    @$img = $()

  subscribe:() ->
    @stream.subscribe( 'Region', (select) => @onRegion(select) )
    return

  readyPane:() ->
    src   = "img/region/Ethiopia.png"
    mh    = @pane.toVh(96)
    mw    = @pane.toVw(96)
    $p    = $( """  #{Dom.image(0,0,100,100,src,mh,"Ethopia","24px",mw)}""" )
    @$image = $p.find('img')
    @$label = $p.find('.label')
    @$label.css( "font-size", "#{@pane.toVh(10)}vh" )
    @$label.hide()
    @subscribe()
    $p

  readyView:() ->
    @readyPane()

  onRegion:( select ) =>
    region = select.study
    if region.img
      src = "img/region/#{region.name}.png"
      @$label.hide()
      @$image.attr( 'src', src ).show()
    else
      label = Util.toName( region.name ) # Puts spaces between Camel Case text
      @$image.hide()
      @$label.text(label).show()
    return
