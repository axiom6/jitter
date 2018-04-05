
import Dom from '../ui/Dom.js'

export default class Body

  constructor:( @stream, @ui ) ->
    @ui.addContent( 'Body', @ )

  readyPane:() ->
    Dom.vert( @stream, @spec, 'img/body/', 0.75, 0, 10 )

  readyView:() ->
    src = "img/body/Body.jpg"
    @$view = $( """<div #{Dom.panel(0, 0,100,100)}></div>"""  )
    @$view.append( "<h1 #{Dom.label(0, 0,100, 10)}>Body</h1>" )
    @$view.append( """  #{Dom.image(0,10,100, 90,src,150)}""" )
    @$view
