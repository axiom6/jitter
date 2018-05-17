
`import Dom  from '../ui/Dom.js'`

class Drink

  constructor:( @stream, @ui ) ->
    @ui.addContent( 'Drink', @ )
    @stream.subscribe( 'Choice', 'Drink', (choice) => @onChoice(choice) )
    @btns = {}

  readyPane:() =>
    Dom.vertBtns( @stream, @spec, @, 'img/drink/', 50, 25, 12 )

  readyView:() =>
    $("""<h1 style=" display:grid; justify-self:center; align-self:center; ">Drink</h1>""" )

  onChoice:( choice ) =>
    Dom.onChoice( choice, 'Drink', @ )
    return

`export default Drink`
