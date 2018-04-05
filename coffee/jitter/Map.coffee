
import Dom from '../ui/Dom.js'

export default class Map

  constructor:( @stream, @ui ) ->
    @ui.addContent( 'Map', @ )

  readyPane:() ->
    Dom.vert( @stream, @spec, 'img/map/', 0.75, 0, 10 )

  readyView:() ->
    src = "img/body/Map.jpg"
    @$view = $( """<div #{Dom.panel(0, 0,100,100)}></div>"""  )
    @$view.append( "<h1 #{Dom.label(0, 0,100, 10)}>Map</h1>" )
    @$view.append( """  #{Dom.image(0,10,100, 90,src,150)}""" )
    @$view