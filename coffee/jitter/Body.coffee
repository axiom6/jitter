
`import Dom from '../ui/Dom.js'`

class Body

  constructor:( @stream, @ui ) ->
    @ui.addContent( 'Body', @ )
    @stream.subscribe( 'Choice', 'Body', (choice) => @onChoice(choice) )
    @btns = {}

  readyPane:() =>
    Dom.vertBtns( @stream, @spec, @, 'img/body/', 45, 25, 12 )

  readyView:() =>
    src = "img/body/Body.jpg"
    @$view = $( """<div #{Dom.panel(0, 0,100,100)}></div>"""  )
    @$view.append( "<h1 #{Dom.label(0, 0,100, 10)}>Body</h1>" )
    @$view.append( """  #{Dom.image(src,80,80)}""" )
    @$view

  onChoice:( choice ) =>
    Dom.onChoice( choice, 'Body', @ )
    return

`export default Body`
