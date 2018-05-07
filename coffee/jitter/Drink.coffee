
`import Dom  from '../ui/Dom.js'`

class Drink

  constructor:( @stream, @ui ) ->
    @ui.addContent( 'Drink', @ )
    @stream.subscribe( 'Choice', 'Drink', (choice) => @onChoice(choice) )
    @btns = {}

  readyPane:() ->
    Dom.vertBtns( @stream, @spec, @, 'img/drink/', 60, 25, 12 )

  readyView:() ->
    src = "img/drink/Drink.jpg"
    @$view = $( """<div #{Dom.panel(0, 0,100,100)}></div>""" )
    @$view.append( "<h1 #{Dom.label(0, 0,100, 10)}>Drink</h1>" )
    @$view.append( """  #{Dom.image(src,@pane.toVh(80),@pane.toVw(80))}""" )
    @$view

  onChoice:( choice ) =>
    Dom.onChoice( choice, 'Drink', @ )
    return

`export default Drink`
