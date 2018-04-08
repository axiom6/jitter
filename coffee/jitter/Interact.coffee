
import Util from '../util/Util.js'
import UI   from '../ui/UI.js'
import Dom  from '../ui/Dom.js'

export default class Interact

  constructor:( @stream, @ui, @name, @specInteract ) ->
    @ui.addContent( @name, @ )

  readyPane:() ->
    @spec = @specInteract # Qverride?
    console.log( 'Interact.readyPane()', @spec )
    @horz( 0, 10 )

  readyView:() ->
    src = "img/body/Body.jpg"
    @$view = $( """<div #{Dom.panel(0, 0,100,100)}></div>"""  )
    @$view.append( "<h1 #{Dom.label(0, 0,100, 10)}>Body</h1>" )
    @$view.append( """  #{Dom.image(0,10,100, 90,src,150)}""" )
    @$view

  horz:( ) ->
    $p = $( """<div class="panel" style="position:relative; left:0; top:0; width:100%; height:100%; text-align:center;"></div>""" )
    n  =  Util.lenObject( @spec, UI.isChild )
    dx = 100 / n
    w  =  dx * 0.6
    x  =   w * 2 - dx
    y  =  10
    h  = 100 - y * 2
    r  = w * 0.7
    for own key, study of @spec when UI.isChild(key)
      console.log( 'Interact.horz()', key )
      $e = @circle( x, y, w, h, r, key )
      Dom.onEvents( @stream, $e, @spec, key, study )
      $p.append( $e )
      x = x + dx
    $p

  circle:( x, y, w, h, r, label, klass="circle" ) ->
    style = "display:table; border:black solid 4px; border-radius:#{r}vmin; position:absolute; left:#{x}%; top:#{y}%; width:#{w}%; height:#{h}%; text-align:center;"
    console.log( 'Interact.style', style )
    $c    = $("""<div class="#{klass}" style="#{style}"></div>""")
    $c.append( """<div style="display:table-cell; vertical-align:middle">#{label}</div>""" )
    $c
