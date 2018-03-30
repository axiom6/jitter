
class Body

  Jitter.Body = Body

  constructor:( @stream, @ui ) ->
    @ui.addContent( 'Body', @ )

  readyPane:() ->
    UI.Dom.vert( @stream, @spec, 'img/body/', 0.75, 0, 10 )

  readyView:() ->
    src = "img/body/Body.jpg"
    @$view = $( """<div #{UI.Dom.panel(0, 0,100,100)}></div>""" )
    @$view.append( "<h1 #{UI.Dom.label(0, 0,100, 10)}>Body</h1>" )
    @$view.append( """  #{UI.Dom.image(0,10,100, 90,src,150)}""" )
    @$view
