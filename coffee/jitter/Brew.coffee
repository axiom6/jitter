
`import Dom from '../ui/Dom.js'`

class Brew

  constructor:( @stream, @ui ) ->
    @ui.addContent( 'Brew', @ )
    @stream.subscribe( 'Choice', 'Brew', (choice) => @onChoice(choice) )
    @btns = {}

  readyPane:() =>
    Dom.vertBtns( @stream, @spec, @, 'img/brew/', 80, 10, 12 )

  readyView:() =>
    $("""<h1 style=" display:grid; justify-self:center; align-self:center; ">Brew</h1>""" )

  onChoice:( choice ) =>
    Dom.onChoice( choice, 'Brew', @ )
    return

`export default Brew`


