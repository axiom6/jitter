
`import Dom from '../ui/Dom.js'`

class Brew

  constructor:( @stream, @ui ) ->
    @ui.addContent( 'Brew', @ )
    @stream.subscribe( 'Choice', 'Brew', (choice) => @onChoice(choice) )
    @btns = {}

  readyPane:() =>
    Dom.vertBtns( @stream, @spec, @, 'img/brew/', 50, 25, 12 )

  readyView:() =>
    src = "img/brew/"+spec['AutoDrip'].icon
    @$view = $( """<div #{Dom.panel(0, 0,100,100)}></div>""" )
    @$view.append( "<h1 #{Dom.label(0, 0,100, 10)}>Brew</h1>" )
    @$view.append( """  #{Dom.image(src,@pane.toVh(80),@pane.toVw(80))}""" )
    @$view

  onChoice:( choice ) =>
    Dom.onChoice( choice, 'Brew', @ )
    return

`export default Brew`


