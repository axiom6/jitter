
`import Dom from '../ui/Dom.js'`

class Body

  constructor:( @stream, @ui ) ->
    @ui.addContent( 'Body', @ )

  readyPane:() ->
    Dom.vertBtns( @stream, @spec, 'img/body/', 80, 0, 8 )

  readyView:() ->
    src = "img/body/Body.jpg"
    @$view = $( """<div #{Dom.panel(0, 0,100,100)}></div>"""  )
    @$view.append( "<h1 #{Dom.label(0, 0,100, 10)}>Body</h1>" )
    @$view.append( """  #{Dom.image(0,10,100, 90,src,150)}""" )
    @$view

`export default Body`
