
import Dom  from '../ui/Dom.js'

export default class Drink

  constructor:( @stream, @ui ) ->
    @ui.addContent( 'Drink', @ )

  readyPane:() ->
    Dom.vertBtns( @stream, @spec, 'img/drink/', 80, 0, 8 )

  readyView:() ->
    src = "img/drink/Drink.jpg"
    @$view = $( """<div #{Dom.panel(0, 0,100,100)}></div>""" )
    @$view.append( "<h1 #{Dom.label(0, 0,100, 10)}>Drink</h1>" )
    @$view.append( """  #{Dom.image(0,10,100, 90,src,150)}""" )
    @$view
