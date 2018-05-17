
`import Dom from '../ui/Dom.js'`

class Body

  constructor:( @stream, @ui ) ->
    @ui.addContent( 'Body', @ )
    @stream.subscribe( 'Choice', 'Body', (choice) => @onChoice(choice) )
    @btns = {}

  readyPane:() =>
    Dom.vertBtns( @stream, @spec, @, 'img/body/', 45, 25, 12 )

  readyView:() =>
    $("""<h1 style=" display:grid; justify-self:center; align-self:center; ">Body</h1>""" )

  onChoice:( choice ) =>
    Dom.onChoice( choice, 'Body', @ )
    return

`export default Body`
