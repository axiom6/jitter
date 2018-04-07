
import Dom from '../ui/Dom.js'

export default class Region

  constructor:( @stream, @ui ) ->
    @ui.addContent( 'Region', @ )
    @$img = $()

  subscribe:() ->
    @stream.subscribe( 'Region', (pub) => @onRegion(pub) )
    return

  readyPane:() ->
    src   = "img/region/Ethiopia.png"
    $p    = $( """  #{Dom.image(0,0,100,100,src,100,"","24px",66)}""" )
    @$img = $p.find('img')
    @subscribe()
    $p

  readyView:() ->
    @readyPane()

  onRegion:( pub ) =>
    src = "img/region/#{pub.study}.png"
    @$img.attr( 'src', src )
    return
