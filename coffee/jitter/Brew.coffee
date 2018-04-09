
import Dom from '../ui/Dom.js'

export default class Brew

  constructor:( @stream, @ui ) ->
    @ui.addContent( 'Brew', @ )

  readyPane:() ->
    Dom.vert( @stream, @spec, 'img/brew/', 0.50, 0, 12 )


  readyView:() ->
    src = "img/brew/"+spec['AutoDrip'].icon
    @$view = $( """<div #{Dom.panel(0, 0,100,100)}></div>""" )
    @$view.append( "<h1 #{Dom.label(0, 0,100, 10)}>Brew</h1>" )
    @$view.append( """  #{Dom.image(0,10,100, 90,src,150)}""" )
    @$view




