
`import Dom  from '../ui/Dom.js'`

class Head

  constructor:( @stream, @ui, @name ) ->
    @ui.addContent( @name, @ )

  readyPane:() ->
    src = "img/logo/JitterBoxHead.png"
    $( """  #{Dom.image(0,0,100,100,src,22,"","24px",105)}""" )

  readyView:() ->
    @readyPane()

`export default Head`


