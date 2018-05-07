
`import Dom  from '../ui/Dom.js'`

class Head

  constructor:( @stream, @ui, @name ) ->
    @ui.addContent( @name, @ )

  readyPane:() ->
    src = "img/logo/JitterBoxHead.png"
    $( """  #{Dom.image(src,@pane.toVh(80),@pane.toVw(80),"","24px")}""" )

  readyView:() ->
    @readyPane()

`export default Head`


